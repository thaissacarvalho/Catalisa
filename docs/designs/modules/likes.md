# LikesModule

## Dependências

Importa Users, Solutions e Comments para validar ator e visibilidade do alvo.

## Endpoints

```mermaid
flowchart TD
    P[POST /likes] --> PC[CreateLikeController]
    PC --> PD[UserLikeTargetDto]
    PC --> PU[CreateLikeUseCase]
    PU --> EV[EnsureLikeTargetVisibleUseCase]
    PU --> UR[UserRepository]
    PU --> LR[LikeRepository]

    D[DELETE /likes] --> DC[DeleteLikeController]
    DC --> DD[UserLikeTargetDto]
    DC --> DU[DeleteLikeUseCase]
    DU --> UR
    DU --> LR

    G[GET /likes/count] --> GC[CountByLikeController]
    GC --> GD[LikeTargetDto]
    GC --> GU[CountByLikeUseCase]
    GU --> EV
    GU --> LR

    LR --> SLR[SequelizeLikeRepository]
    SLR --> LM[LikeModel]
```

## Regras

- Ator precisa ser `PARTICIPANT` ou `SUPER_ADMIN` e estar ativo.
- Criação e contagem exigem alvo visível.
- Índices únicos impedem like duplicado por usuário/alvo.
- Remoção é idempotente e não exige alvo ainda visível.
- `type` define exatamente uma FK: solution ou comment.
