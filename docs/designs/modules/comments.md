# CommentsModule

## Dependências

Importa Solutions, Users e Moderation. Exporta `CommentRepository` e casos de uso usados por outras features.

## Endpoints

```mermaid
flowchart TD
    P[POST /comments] --> PC[CreateCommentController]
    PC --> PD[CreateCommentDto]
    PC --> PU[CreateCommentUseCase]
    PU --> UR[UserRepository]
    PU --> SR[SolutionRepository]
    PU --> CR[CommentRepository]

    G[GET /comments/:commentId] --> GC[FindCommentController]
    GC --> GU[FindCommentUseCase]
    GU --> CR

    L[GET /solutions/:solutionId/comments] --> LC[FindCommentBySolutionController]
    LC --> LU[FindCommentBySolutionUseCase]
    LU --> CR

    U[PATCH /comments/admin/:commentId/status] --> Guard[JWT + Roles + PasswordUpdated]
    Guard --> UC[UpdateCommentStatusController]
    UC --> UU[UpdateCommentStatusUseCase]
    UU --> DR[DirectRemovalUseCase]
    UU --> CR

    CR --> SCR[SequelizeCommentRepository]
    SCR --> CM[CommentModel]
```

## Regras

- Texto normalizado com 50 a 280 caracteres.
- Autor precisa existir e estar `ACTIVE`.
- Solução precisa estar publicada.
- Resposta exige pai da mesma solução.
- `SUPER_ADMIN` exclui diretamente com motivo; `ADMIN` usa solicitação de remoção.
