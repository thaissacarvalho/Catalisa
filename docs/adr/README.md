# Architecture Decision Records

ADRs registram decisões técnicas aceitas. Depois de aceito, um ADR é imutável; correções editoriais pequenas são permitidas, mas uma mudança de decisão exige um novo ADR que marque o anterior como substituído.

| ADR | Status | Decisão |
| --- | --- | --- |
| [0001](./0001-record-architecture-decisions.md) | Accepted | Registrar decisões arquiteturais |
| [0002](./0002-modular-layered-architecture.md) | Accepted | Monólito modular em camadas |
| [0003](./0003-migrations-as-schema-source.md) | Accepted | Migrations como fonte do schema |
| [0004](./0004-admin-jwt-authentication.md) | Accepted | JWT administrativo com versão de credencial |
| [0005](./0005-two-path-content-moderation.md) | Accepted | Moderação direta e em duas etapas |

## Estados

- `Proposed`: em avaliação;
- `Accepted`: decisão vigente;
- `Deprecated`: não recomendada, ainda presente;
- `Superseded`: substituída por outro ADR.
