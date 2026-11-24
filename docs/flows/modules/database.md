# Flow: DatabaseModule

## Inicialização e encerramento

~~~mermaid
sequenceDiagram
  participant N as NestJS
  participant S as Sequelize
  participant DB as PostgreSQL
  N->>S: cria instância única
  N->>S: inicializa associações
  N->>DB: authenticate()
  DB-->>N: conexão aceita
  N-->>N: disponibiliza repositories
  N->>S: onApplicationShutdown()
  S->>DB: close()
~~~

## Migration flow

~~~mermaid
flowchart TD
  A[Ambiente preparado] --> B[sequelize-cli db:migrate]
  B --> C{Migration aplicada?}
  C -- não --> D[Cria/atualiza schema]
  C -- sim --> E[Prossegue sem duplicar estrutura]
  D --> E
  E --> F[API pode inicializar]
~~~

Migrations devem ser aplicadas antes da API e nunca substituídas por sincronização automática de models.

