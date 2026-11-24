# Flow: AuthenticationModule

## Login administrativo

```mermaid
sequenceDiagram
    participant A as Admin
    participant C as Controller
    participant S as AuthenticationService
    participant U as UserRepository
    participant R as CredentialRepository
    A->>C: email + password
    C->>S: loginAdmin()
    S->>U: findByEmail(email normalizado)
    alt usuário ausente ou papel inválido
        S->>S: compara dummy hash
        S-->>A: 401 INVALID_ADMIN_CREDENTIALS
    else admin inativo
        S-->>A: 403 ADMIN_ACCOUNT_INACTIVE
    else admin ativo
        S->>R: findByUserId()
        S->>S: compara bcrypt
        alt credencial ausente ou senha incorreta
            S-->>A: 401 INVALID_ADMIN_CREDENTIALS
        else credencial válida
            S-->>A: accessToken + identidade
        end
    end
```

A comparação com hash fixo reduz diferença de tempo entre e-mail inexistente e senha incorreta. Credenciais inválidas retornam `401`. Uma conta administrativa inativa recebe `403`.

## Validação de uma rota protegida

```mermaid
flowchart LR
    A[Bearer token] --> B[JwtAuthGuard]
    B --> C[Assinatura, issuer, audience e expiração]
    C --> D[Usuário e credencial atuais no banco]
    D --> E[credentialVersion, role e status]
    E --> F[RolesGuard]
    F --> G[AdminPasswordUpdatedGuard]
    G --> H[Controller]
```

Nem toda rota usa todos os guards. `GET /authentication/me` exige apenas JWT; a troca de senha exige JWT e papel; rotas administrativas comuns também exigem senha inicial alterada.

## Rotação de senha

```mermaid
stateDiagram-v2
    [*] --> TEMPORARY: bootstrap ou promoção
    TEMPORARY --> ACTIVE: senha atual validada e novo hash salvo
    ACTIVE --> ACTIVE: nova troca de senha
```

Cada troca atualiza `passwordChangedAt`. Esse valor participa do token como `credentialVersion`, invalidando tokens emitidos antes da alteração.

## Promoção

Somente `SUPER_ADMIN` promove `PARTICIPANT`. A operação gera uma senha temporária aleatória, cria a credencial bcrypt e muda o papel para `ADMIN` de forma atômica. A senha temporária aparece somente na resposta da promoção.
