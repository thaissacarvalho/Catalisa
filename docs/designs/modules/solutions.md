# SolutionsModule

## Dependências

Importa Users, Challenges e Moderation. Exporta `SolutionRepository` para Comments e Likes.

## Endpoints

```mermaid
flowchart TD
    P[POST /solutions] --> PC[CreateSolutionController]
    PC --> PD[CreateSolutionDto]
    PC --> PU[CreateSolutionUseCase]
    PU --> UR[UserRepository]
    PU --> CR[ChallengeRepository]
    PU --> SR[SolutionRepository]

    G[GET /solutions/:solutionId] --> GC[ListPublishedSolutionController]
    GC --> GU[ListPublishedSolutionUseCase]
    GU --> SR

    L[GET /challenges/:challengeId/solutions] --> LC[ListPublishedSolutionsController]
    LC --> LU[ListPublishedSolutionsUseCase]
    LU --> SR

    A[GET /admin/solutions] --> AG[JWT + Roles + PasswordUpdated]
    AG --> AC[ListSolutionsForAdminController]
    AC --> AU[ListSolutionsForAdminUseCase]
    AU --> SR

    U[PATCH /admin/solutions/:solutionId/status] --> UG[JWT + Roles + PasswordUpdated]
    UG --> UC[UpdateSolutionStatusController]
    UC --> UU[UpdateSolutionStatusUseCase]
    UU --> DR[DirectRemovalUseCase]
    UU --> SR

    SR --> SSR[SequelizeSolutionRepository]
    SSR --> SM[SolutionModel]
```

## Regras

- Somente `PARTICIPANT` ou `SUPER_ADMIN` ativo publica.
- O challenge precisa estar ativo.
- Consultas públicas retornam somente `PUBLISHED` com autor elegível.
- `ADMIN` não remove diretamente; deve abrir solicitação.
- `SUPER_ADMIN` remove diretamente com motivo e registro de moderação `APPROVED`.
- `ADMIN` e `SUPER_ADMIN` podem republicar.
