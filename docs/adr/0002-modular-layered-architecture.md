# ADR 0002: Monólito modular em camadas

- Status: Accepted
- Data do registro: 2026-11-05

## Contexto

O produto possui features relacionadas, compartilha banco e precisa evoluir com baixo custo operacional. Ao mesmo tempo, regras de negócio não devem ficar acopladas a HTTP ou Sequelize.

## Decisão

Adotar um monólito modular NestJS. Cada feature separa `application`, `domain` e `infrastructure`; controllers chamam casos de uso, casos de uso dependem de ports e repositories Sequelize implementam esses ports.

## Consequências

### Positivas

- deploy e transações permanecem simples;
- regras podem ser testadas sem banco ou HTTP;
- adapters podem mudar sem alterar o domínio;
- dependências entre features ficam visíveis nos módulos NestJS.

### Negativas

- disciplina arquitetural precisa ser revisada em PRs;
- imports circulares entre features são um risco;
- o monólito compartilha falhas e escala como uma unidade.
