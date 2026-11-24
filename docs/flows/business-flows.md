# Flows de negócio

Jornadas principais da CATALISA, do cliente até a persistência. Para payloads completos, consulte a [referência da API](../guides/api-reference.md).

## 1. Inicialização do ambiente

```mermaid
sequenceDiagram
    participant Dev as Desenvolvedor
    participant Compose as Docker Compose
    participant DB as PostgreSQL
    participant Mig as migrate
    participant API as CATALISA
    Dev->>Compose: docker compose up --build -d
    Compose->>DB: inicia PostgreSQL
    loop até ficar saudável
        Compose->>DB: pg_isready
    end
    Compose->>Mig: npm run db:migrate
    Mig->>DB: aplica migrations pendentes
    alt migration concluída
        Compose->>API: inicia processo
        API->>DB: inicializa associações e autentica conexão
        API-->>Dev: /docs disponível
    else migration falha
        Compose-->>Dev: API não inicia
    end
```

O schema vem das migrations. A API não usa sincronização automática para criar tabelas.

## 2. Entrada do participante

```mermaid
flowchart TD
    A[POST /users] --> B{DTO válido?}
    B -- não --> X1[400 INVALID_REQUEST]
    B -- sim --> C[Normalizar nome, email, cargo e empresa]
    C --> D{Email já existe?}
    D -- sim --> X2[409 USER_ALREADY_EXISTS]
    D -- não --> E[Gerar userCode]
    E --> F[Criar PARTICIPANT ACTIVE]
    F --> G[201 USER_CREATED]
    G --> H[Cliente guarda userCode]
```

O `userCode` identifica o participante nos endpoints públicos, mas não é uma credencial criptográfica. Quem conhece o código pode tentar operar em nome do participante; essa limitação deve ser considerada no modelo de ameaças.

## 3. Publicação e descoberta de soluções

```mermaid
sequenceDiagram
    participant P as Participante
    participant API
    participant S as SolutionsUseCase
    participant U as UserRepository
    participant C as ChallengeRepository
    participant R as SolutionRepository
    P->>API: POST /solutions
    API->>S: userCode + challengeId + conteúdo
    S->>U: buscar autor
    U-->>S: usuário
    S->>S: exigir ACTIVE e papel PARTICIPANT/SUPER_ADMIN
    S->>C: buscar challenge ativo
    C-->>S: challenge
    S->>R: persistir PUBLISHED
    R-->>P: 201 SOLUTION_CREATED
    P->>API: GET /challenges/:challengeId/solutions
    API->>R: listar soluções públicas
    R-->>P: somente PUBLISHED com autor ativo
```

`ADMIN` não publica nem curte; `SUPER_ADMIN` pode participar desses fluxos. Soluções removidas permanecem no banco para auditoria, mas saem das consultas públicas.

## 4. Comentários, respostas e likes

```mermaid
flowchart TD
    U[Usuário ACTIVE] --> C[POST /comments]
    C --> CV{Solução publicada?}
    CV -- não --> E1[404 SOLUTION_NOT_FOUND]
    CV -- sim --> P{Possui parentCommentId?}
    P -- não --> CR[Criar comentário ACTIVE]
    P -- sim --> PV{Pai visível e da mesma solução?}
    PV -- não --> E2[404 PARENT_COMMENT_NOT_FOUND]
    PV -- sim --> CR

    U --> L[POST /likes]
    L --> LR{Papel PARTICIPANT ou SUPER_ADMIN?}
    LR -- não --> E3[403 FORBIDDEN]
    LR -- sim --> LV{Alvo visível?}
    LV -- não --> E4[404 recurso]
    LV -- sim --> LD{Like já existe?}
    LD -- sim --> E5[409 LIKE_ALREADY_EXISTS]
    LD -- não --> LC[Criar like]
```

A remoção do like é idempotente e continua permitida quando o alvo ficou oculto. A contagem inclui somente likes de usuários ativos em alvos visíveis.

## 5. Bootstrap, login e troca de senha

```mermaid
sequenceDiagram
    participant Op as Operador
    participant Script as bootstrap-admin
    participant Admin
    participant Auth as AuthenticationService
    participant DB
    Op->>Script: npm run admin:bootstrap
    Script->>DB: cria SUPER_ADMIN + hash bcrypt
    DB-->>Op: mustChangePassword=true
    Admin->>Auth: POST /authentication/admin/login
    Auth->>DB: busca usuário e credencial
    Auth->>Auth: valida papel, status e bcrypt
    Auth-->>Admin: accessToken temporário
    Admin->>Auth: PATCH /authentication/admin/password
    Auth->>DB: grava novo hash e passwordChangedAt
    Auth-->>Admin: novo accessToken
    Admin->>Auth: usa token anterior
    Auth-->>Admin: 401 INVALID_ACCESS_TOKEN
```

Enquanto `mustChangePassword=true`, o admin pode consultar a identidade e trocar a senha, mas `AdminPasswordUpdatedGuard` bloqueia as demais rotas administrativas.

## 6. Moderação

Existem dois caminhos de remoção:

```mermaid
flowchart TD
    A[Conteúdo visível] --> B{Ator}
    B -- SUPER_ADMIN --> C[PATCH status para REMOVED/EXCLUDED + reason]
    C --> D[Cria registro APPROVED]
    D --> E[Remove logicamente na mesma transação]

    B -- ADMIN ou SUPER_ADMIN --> F[POST removal-requests + reason]
    F --> G[Cria PENDING]
    G --> H{Outro ADMIN/SUPER_ADMIN revisa}
    H -- approve --> I[Marca APPROVED e remove alvo]
    H -- reject --> J[Marca REJECTED; alvo permanece]
```

Regras essenciais:

- `ADMIN` recebe `409 REMOVAL_REQUIRES_APPROVAL` se tentar remoção direta;
- o mesmo administrador não pode revisar a própria solicitação;
- existe no máximo uma solicitação `PENDING` por alvo;
- solicitações encerradas não podem ser revistas novamente;
- aprovação e mudança do alvo compartilham transação.

Administradores podem republicar soluções removidas e reativar comentários inativos. Comentários excluídos permanecem em `EXCLUDED`. O histórico da moderação é preservado.

## Matriz de autorização

| Ação | Sem JWT / `PARTICIPANT` | `ADMIN` | `SUPER_ADMIN` |
| --- | --- | --- | --- |
| Consultar conteúdo público | sim | sim | sim |
| Criar cadastro | sim | sim | sim |
| Publicar solução | `PARTICIPANT` ativo | não | sim, se ativo |
| Comentar | usuário ativo | sim, se ativo | sim, se ativo |
| Criar/remover like | `PARTICIPANT` ativo | não | sim, se ativo |
| Alterar status administrativo | não | sim, exceto remoção direta | sim |
| Criar/revisar solicitação | não | sim | sim |
| Promover participante para admin | não | não | sim |

As operações de participante recebem `userCode` no payload e não usam JWT. As operações administrativas exigem token, papel compatível e senha inicial já trocada.
