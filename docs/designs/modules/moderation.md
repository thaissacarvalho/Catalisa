# ModerationModule

## Dependências

Usa `ModerationRepository`/`SequelizeModerationRepository` e exporta `DirectRemovalUseCase`. A autenticação vem do módulo global.

## Endpoints

```mermaid
flowchart TD
    P[POST /admin/moderation/removal-requests] --> G1[JWT + Roles + PasswordUpdated]
    G1 --> PC[CreateRemovalRequestController]
    PC --> PD[CreateRemovalRequestDto]
    PC --> PU[CreateRemovalRequestUseCase]
    PU --> MR[ModerationRepository]

    L[GET /admin/moderation/removal-requests] --> G2[JWT + Roles + PasswordUpdated]
    G2 --> LC[ListRemovalRequestsController]
    LC --> LU[ListRemovalRequestsUseCase]
    LU --> MR

    A[PATCH .../:requestId/approve] --> G3[JWT + Roles + PasswordUpdated]
    G3 --> AC[ApproveRemovalRequestController]
    AC --> RU[ReviewRemovalRequestUseCase]
    RU --> MR

    R[PATCH .../:requestId/reject] --> G4[JWT + Roles + PasswordUpdated]
    G4 --> RC[RejectRemovalRequestController]
    RC --> RU

    MR --> SMR[SequelizeModerationRepository]
    SMR --> MM[ModerationRequestModel]
    SMR --> Targets[SolutionModel / CommentModel]
```

## Regras

- Acesso: `ADMIN` ou `SUPER_ADMIN` com senha inicial alterada.
- Uma solicitação pendente por alvo. `ADMIN` e `SUPER_ADMIN` podem abrir pedidos.
- O solicitante não revisa o próprio pedido.
- Aprovação remove logicamente o alvo na mesma transação.
- Rejeição preserva o alvo.
- `DirectRemovalUseCase` cria auditoria já aprovada para remoção por `SUPER_ADMIN` quando não há pendência para o alvo.
