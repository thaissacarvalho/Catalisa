# UsersModule

## Dependências

Não importa outros módulos de negócio. Exporta `UserRepository` e `UpdateUserStatusUseCase`.

## Endpoints registrados

```mermaid
flowchart TD
    C[POST /users] --> CC[CreateUserController]
    CC --> CD[CreateUserDto]
    CC --> CU[CreateUserUseCase]
    CU --> UR[UserRepository]
    UR --> SR[SequelizeUserRepository]
    SR --> UM[UserModel]

    G[GET /users/:userCode] --> GC[GetUserByUserCodeController]
    GC --> GU[ListUserByUserCodeUseCase]
    GU --> UR

    P[PATCH /users/admin/:userCode/status] --> Guards[JWT + Roles + PasswordUpdated]
    Guards --> PC[UpdateUserByStatusController]
    PC --> UD[UpdateUserStatusDto]
    PC --> UU[UpdateUserStatusUseCase]
    UU --> UR
```

| Endpoint | Acesso | Regra principal |
| --- | --- | --- |
| `POST /users` | público | normaliza dados, impede e-mail duplicado e gera `userCode` |
| `GET /users/:userCode` | público | retorna somente perfil público |
| `PATCH /users/admin/:userCode/status` | ADMIN/SUPER_ADMIN | status deve pertencer a `UserStatus` |

## Limite importante

`ListUsersController`, `ListUserByIdController` e `ListUserByEmailController` existem em `src/users/application/controllers`, mas não estão no array `controllers` de `UsersModule`. Suas rotas não fazem parte da API ativa; as duas rotas dinâmicas também colidem entre si.
