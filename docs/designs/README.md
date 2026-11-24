# Designs

Esta pasta descreve a arquitetura implementada em `src/`. Cada documento de módulo parte dos controllers realmente registrados, mostra a cadeia de dependências por endpoint e registra regras observáveis no código.

## Visão geral

- [Arquitetura](./architecture.md)
- [Dependências entre módulos](./dependencies.md)
- [Modelo de dados](./data-model.md)

## Módulos

| Módulo | Documento | Endpoints |
| --- | --- | ---: |
| App | [AppModule](./modules/app.md) | 0 |
| Database | [DatabaseModule](./modules/database.md) | 0 |
| Authentication | [AuthenticationModule](./modules/authentication.md) | 4 |
| Users | [UsersModule](./modules/users.md) | 3 |
| Challenges | [ChallengesModule](./modules/challenges.md) | 3 |
| Solutions | [SolutionsModule](./modules/solutions.md) | 5 |
| Comments | [CommentsModule](./modules/comments.md) | 4 |
| Likes | [LikesModule](./modules/likes.md) | 3 |
| Moderation | [ModerationModule](./modules/moderation.md) | 4 |

Total: 26 endpoints registrados.

## Padrão de leitura

Em cada endpoint:

```text
rota -> controller -> DTO -> use case/service -> port -> adapter -> tabela
```

Imports de módulo mostram dependências de composição. Injeções em use cases mostram dependências de comportamento. Associações e foreign keys mostram dependências de persistência.
