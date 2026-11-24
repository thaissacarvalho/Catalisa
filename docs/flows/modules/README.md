# Flows por módulo

Cada documento mostra entradas, dependências, decisões e saídas do módulo em execução.

| Módulo | Responsabilidade | Flow |
| --- | --- | --- |
| App | Bootstrap HTTP e composição | [AppModule](./app.md) |
| Database | Conexão, associações e encerramento | [DatabaseModule](./database.md) |
| Authentication | Login, JWT, senha e promoção | [AuthenticationModule](./authentication.md) |
| Users | Cadastro, perfil e status | [UsersModule](./users.md) |
| Challenges | Consulta pública e status | [ChallengesModule](./challenges.md) |
| Solutions | Publicação, consulta e remoção | [SolutionsModule](./solutions.md) |
| Comments | Comentários, respostas e status | [CommentsModule](./comments.md) |
| Likes | Criação, remoção e contagem | [LikesModule](./likes.md) |
| Moderation | Solicitação, revisão e remoção transacional | [ModerationModule](./moderation.md) |

Para jornadas que atravessam vários módulos, use os [flows de negócio](../business-flows.md).
