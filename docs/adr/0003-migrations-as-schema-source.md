# ADR 0003: Migrations como fonte do schema

- Status: Accepted
- Data do registro: 2026-11-05

## Contexto

Models Sequelize descrevem o acesso ao banco, mas sincronização automática não oferece histórico seguro, revisão de constraints ou controle previsível de produção.

## Decisão

Usar `migrations/` como fonte versionada do schema. A API não executa `sequelize.sync()`. O processo de deploy aplica migrations antes de iniciar a API.

## Consequências

- toda mudança de schema exige migration incremental;
- `up` e `down` precisam ser testados em banco descartável;
- model, mapper e migration devem permanecer alinhados;
- deploy falha antes de receber tráfego quando uma migration falha.
