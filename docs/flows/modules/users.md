# Flow: UsersModule

## Criação de usuário

~~~mermaid
sequenceDiagram
  participant C as Client
  participant U as CreateUserController
  participant UC as CreateUserUseCase
  participant R as UserRepository
  participant DB as PostgreSQL
  C->>U: POST /users
  U->>U: ValidationPipe + DTO
  U->>UC: dados válidos
  UC->>UC: trim e normaliza email
  UC->>R: verifica duplicidade
  R->>DB: INSERT users
  DB-->>R: usuário persistido
  R-->>UC: UserEntity
  UC-->>C: 201 USER_CREATED
~~~

## Alteração de status

~~~mermaid
flowchart TD
  A[PATCH /users/admin/:userCode/status] --> B[Validar JWT e role]
  B --> C[Validar UserStatus]
  C --> D[UpdateUserStatusUseCase]
  D --> E{Usuário existe?}
  E -- não --> F[404 USER_NOT_FOUND]
  E -- sim --> G[Repository update]
  G --> H[Resposta de sucesso]
~~~

A autoria e os campos privilegiados não devem vir livremente do body do cadastro.

