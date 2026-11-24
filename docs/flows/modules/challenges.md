# Flow: ChallengesModule

## Consulta pública

~~~mermaid
sequenceDiagram
  participant C as Client
  participant CT as FindAllChallengeController
  participant UC as FindAllChallengeUseCase
  participant R as ChallengeRepository
  C->>CT: GET /challenges
  CT->>UC: consulta
  UC->>R: find active challenges
  R-->>UC: coleção
  UC-->>C: 200 com lista pública
~~~

## Alteração administrativa

~~~mermaid
flowchart LR
  A[PATCH /admin/challenges/:challengeId/status] --> B[JWT + Roles + PasswordUpdated]
  B --> C[UpdateChallengeStatusUseCase]
  C --> D[ChallengeRepository]
  D --> E[PostgreSQL]
  E --> F[Status atualizado]
~~~

Um challenge `INACTIVE` não aparece nas consultas públicas. Solicitar o status atual novamente retorna `CHALLENGE_STATUS_UNCHANGED`.

