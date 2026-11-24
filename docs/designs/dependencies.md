# Dependências entre módulos

## Composição NestJS

```mermaid
flowchart TD
    App[AppModule] --> DB[DatabaseModule]
    App --> Users[UsersModule]
    App --> Auth[AuthenticationModule]
    App --> Challenges[ChallengesModule]
    App --> Solutions[SolutionsModule]
    App --> Comments[CommentsModule]
    App --> Likes[LikesModule]
    App --> Moderation[ModerationModule]

    Auth --> Users
    Solutions --> Users
    Solutions --> Challenges
    Solutions --> Moderation
    Comments --> Users
    Comments --> Solutions
    Comments --> Moderation
    Likes --> Users
    Likes --> Solutions
    Likes --> Comments
```

`AuthenticationModule` é global e exporta guards, JWT, serviço e repository de credenciais. `ModerationModule` exporta `DirectRemovalUseCase` para Solutions e Comments.

## Matriz

| Consumidor | Dependência | Motivo |
| --- | --- | --- |
| Authentication | Users | localizar identidade, papel e status |
| Solutions | Users | validar autor |
| Solutions | Challenges | validar desafio ativo |
| Solutions | Moderation | remoção direta auditada |
| Comments | Users | validar autor |
| Comments | Solutions | exigir solução publicada |
| Comments | Moderation | exclusão direta auditada |
| Likes | Users | validar ator ativo e papel |
| Likes | Solutions/Comments | validar alvo visível |
| Moderation | Models de Solutions/Comments | validar e alterar alvo em transação |

## Persistência

```mermaid
erDiagram
    USERS ||--o| ADMIN_CREDENTIALS : possui
    USERS ||--o{ SOLUTIONS : publica
    CHALLENGES ||--o{ SOLUTIONS : agrupa
    SOLUTIONS ||--o{ COMMENTS : recebe
    COMMENTS ||--o{ COMMENTS : responde
    USERS ||--o{ COMMENTS : escreve
    USERS ||--o{ LIKES : cria
    SOLUTIONS ||--o{ LIKES : recebe
    COMMENTS ||--o{ LIKES : recebe
    USERS ||--o{ MODERATION_REQUESTS : solicita_revisa
    SOLUTIONS ||--o{ MODERATION_REQUESTS : alvo
    COMMENTS ||--o{ MODERATION_REQUESTS : alvo
```
