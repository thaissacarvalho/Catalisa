# DatabaseModule

## Papel

Autentica a instância Sequelize no bootstrap, inicializa associações uma vez e fecha a conexão no shutdown.

```mermaid
sequenceDiagram
    participant Nest as NestJS
    participant DM as DatabaseModule
    participant S as Sequelize
    participant DB as PostgreSQL
    Nest->>DM: onModuleInit
    DM->>S: initializeModelAssociations()
    DM->>DB: authenticate()
    DB-->>Nest: aplicação pode iniciar
    Nest->>DM: onApplicationShutdown
    DM->>DB: close()
```

Não possui endpoints. As migrations são aplicadas fora do processo HTTP pelo Sequelize CLI.
