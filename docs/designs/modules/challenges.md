# ChallengesModule

## Dependências

Usa `ChallengeRepository` implementado por `SequelizeChallengeRepository` e exporta o port para Solutions.

## Endpoints

```mermaid
flowchart TD
    A[GET /challenges] --> C1[FindAllChallengeController]
    C1 --> U1[FindAllChallengeUseCase]
    U1 --> R[ChallengeRepository]

    B[GET /challenges/:challengeId] --> C2[FindIdChallengeController]
    C2 --> D2[ChallengeIdParamDto]
    C2 --> U2[FindIdChallengeUseCase]
    U2 --> R

    C[PATCH /admin/challenges/:challengeId/status] --> G[JWT + Roles + PasswordUpdated]
    G --> C3[UpdateChallengeStatusController]
    C3 --> D3[UpdateChallengeStatusDto]
    C3 --> U3[UpdateChallengeStatusUseCase]
    U3 --> R

    R --> SR[SequelizeChallengeRepository]
    SR --> M[ChallengeModel]
```

Consultas públicas retornam apenas `ACTIVE`. A alteração administrativa aceita `ACTIVE` ou `INACTIVE` e rejeita repetição do estado atual.
