# Flow: CommentsModule

## Criar comentário ou resposta

```mermaid
flowchart TD
    A[POST /comments] --> B[Texto com 50 a 280 caracteres]
    B --> C{Usuário existe e está ACTIVE?}
    C -- não --> E1[404 ou 403]
    C -- sim --> D{Solução PUBLISHED existe?}
    D -- não --> E2[404 SOLUTION_NOT_FOUND]
    D -- sim --> F{parentCommentId informado?}
    F -- não --> H[Criar ACTIVE]
    F -- sim --> G{Pai existe e pertence à mesma solução?}
    G -- não --> E3[404 PARENT_COMMENT_NOT_FOUND]
    G -- sim --> H
    H --> I[201 COMMENT_CREATED]
```

O texto é validado novamente no caso de uso por quantidade de caracteres Unicode, além da validação do DTO.

## Visibilidade e status

```mermaid
stateDiagram-v2
    [*] --> ACTIVE: criação
    ACTIVE --> INACTIVE: alteração administrativa
    INACTIVE --> ACTIVE: reativação
    ACTIVE --> EXCLUDED: remoção aprovada ou direta
    INACTIVE --> EXCLUDED: remoção aprovada ou direta
    EXCLUDED --> ACTIVE: reativação administrativa
```

Consultas públicas filtram o status do comentário, a visibilidade da solução e o estado do autor.

`SUPER_ADMIN` pode definir `EXCLUDED` diretamente com motivo. `ADMIN` deve usar o fluxo de solicitação de remoção; ambos podem alternar `ACTIVE` e `INACTIVE`.
