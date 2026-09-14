
# Challenges V2: plano de migration e implementação

## Objetivo

Transformar `challenges` em um catálogo fixo de 12 temas para os quais participantes publicam Solutions. Na V2, Challenge deixa de ser conteúdo criado por participante e deixa de depender de `choices`.

## Decisões da V2

- `Challenge` representa diretamente um dos 12 temas disponíveis.
- A tabela `choices` não participa do fluxo novo.
- Challenge não possui `userCode`, pois não tem autor participante.
- `solutions.challengeId` continua sendo a foreign key para `challenges.id`.
- O catálogo é criado por seeder, não por uma rota pública.
- Somente Challenges `ACTIVE` aceitam novas Solutions.
- Inativar um Challenge não remove suas Solutions já publicadas.

## Estado atual encontrado

| Achado                                                              | Impacto                                                         | Correção da V2                                                                            |
| ------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| A migration usa UUID com `autoIncrement`.                           | PostgreSQL não pode auto-incrementar UUID.                      | Manter `id` como `INTEGER` auto-incrementável para coincidir com `solutions.challengeId`. |
| Migration e model usam tipos diferentes para `id`.                  | A foreign key de Solutions fica incompatível.                   | Padronizar ambos como `INTEGER`.                                                          |
| Challenge possui `userCode`.                                        | Trata um item fixo do catálogo como publicação de participante. | Remover a coluna e a associação com User.                                                 |
| Challenge possui `choice`.                                          | Duplica a ideia de categoria e mantém dependência legada.       | Remover a coluna; cada Choice válida da nova ideia passa a ser um Challenge.              |
| O model procura `uri_choice`, mas Choices possui `uri`.             | Associação não corresponde à tabela real.                       | Eliminar essa associação na V2.                                                           |
| O legado mistura criação de Challenge e Comment usando `data.type`. | Responsabilidades e validações ficam misturadas.                | Manter módulos, DTOs, controllers e casos de uso separados.                               |
| Só existe `existsById` no repository.                               | Ainda não é possível listar ou consultar o catálogo.            | Adicionar operações de leitura e validação de Challenge ativo.                            |

## Schema alvo

| Atributo       | PostgreSQL     | Regra                                                        |
| -------------- | -------------- | ------------------------------------------------------------ |
| `id`           | `INTEGER`      | PK e auto-incremento.                                        |
| `code`         | `VARCHAR(60)`  | Obrigatório, único e imutável; exemplo: `LEADERSHIP`.        |
| `title`        | `VARCHAR(120)` | Nome apresentado ao participante.                            |
| `description`  | `TEXT`         | Explicação do tema.                                          |
| `status`       | `ENUM`         | `ACTIVE` ou `INACTIVE`; default `ACTIVE`.                    |
| `displayOrder` | `SMALLINT`     | Ordem de exibição entre os 12 itens; único e maior que zero. |
| `createdAt`    | `TIMESTAMP`    | Obrigatório.                                                 |
| `updatedAt`    | `TIMESTAMP`    | Obrigatório.                                                 |

Exemplo conceitual:

```json
{
  "id": 1,
  "code": "LEADERSHIP",
  "title": "Liderança",
  "description": "Sugestões para desenvolver e melhorar a liderança.",
  "status": "ACTIVE",
  "displayOrder": 1
}
```

## Migration para banco V2 ainda não aplicado

Se a migration atual nunca foi executada fora de uma base descartável, ela pode ser corrigida diretamente.

Pontos obrigatórios do `up`:

1. Criar `challenges` antes de `solutions`.
2. Criar `id` como `INTEGER`, `primaryKey` e `autoIncrement`.
3. Criar `code` com constraint única.
4. Criar `title`, `description`, `status` e `displayOrder`.
5. Não criar `userCode` nem `choice`.
6. Criar timestamps com defaults coerentes.
7. Criar índice composto para `status` e `displayOrder`.
8. Criar constraint para `displayOrder > 0`.

Pontos obrigatórios do `down`:

1. Remover a tabela `challenges`.
2. Remover explicitamente o tipo ENUM criado pelo PostgreSQL.

A migration deve ser autocontida. Ela não deve importar o enum do domínio, pois uma alteração futura no código não pode mudar o comportamento de uma migration histórica.

## Banco que já recebeu a migration antiga

Não editar uma migration já aplicada. Separar a evolução em migrations incrementais:

### Migration 1 — adicionar estrutura V2

- Adicionar `code`, `description`, `status` e `displayOrder` inicialmente como campos anuláveis.
- Preservar temporariamente `text`, `choice` e `userCode` para permitir o backfill.

### Migration 2 — realizar o backfill

- Mapear os registros legados para os 12 Challenges aprovados.
- Copiar `text` para `description` quando fizer sentido.
- Preencher `code`, `status` e `displayOrder`.
- Tratar duplicidades antes de criar constraints únicas.

### Migration 3 — aplicar constraints

- Tornar os novos campos obrigatórios.
- Adicionar unicidade para `code` e `displayOrder`.
- Adicionar o índice de listagem.
- Adicionar a constraint de ordem positiva.

### Migration 4 — remover campos legados

- Remover `text`, `choice` e `userCode` apenas depois que a aplicação V2 estiver usando os novos campos.
- Remover foreign keys e índices antigos associados a essas colunas.

## Seeder dos 12 Challenges

O catálogo pertence a um seeder separado da migration.

Cada item deve possuir valores determinísticos:

```ts
{
  code: 'LEADERSHIP',
  title: 'Liderança',
  description: '...',
  status: 'ACTIVE',
  displayOrder: 1,
}
```

Regras do seeder:

- Definir previamente os 12 códigos finais.
- Não gerar códigos aleatórios.
- Não depender de IDs fixos de Users ou Choices.
- Preencher `createdAt` e `updatedAt`.
- No `down`, excluir somente os códigos pertencentes ao catálogo do seeder; não apagar indiscriminadamente toda a tabela.

## Model Sequelize

O `ChallengeModel` deve declarar todos os atributos do schema alvo e não importar `UserModel` ou `ChoiceModel`.

O model e a migration precisam coincidir em:

- tipo e tamanho das colunas;
- nulabilidade;
- valores do enum;
- defaults;
- timestamps;
- nome da tabela;
- índices e constraints relevantes.

## Domínio e aplicação

Estrutura desejada:

```text
src/challenges/
  application/
    controllers/
    dto/
    presenters/
    use-cases/
  domain/
    entities/
    enums/
    repositories/
  infrastructure/
    persistence/sequelize/
      mappers/
      models/
      repositories/
  challenges.module.ts
```

O repository deverá evoluir para:

```ts
export interface ChallengeRepository {
  findAllActive(): Promise<ChallengeEntity[]>;
  findById(challengeId: number): Promise<ChallengeEntity | null>;
  existsActiveById(challengeId: number): Promise<boolean>;
  updateStatus(
    challengeId: number,
    status: ChallengeStatus,
  ): Promise<ChallengeEntity | null>;
}
```

`existsById` deve virar `existsActiveById` no fluxo de criação de Solution. Assim, uma Solution não pode ser criada para um Challenge inativo.

## Contratos HTTP

| Método e rota                                 | Finalidade                                    | Acesso                  |
| --------------------------------------------- | --------------------------------------------- | ----------------------- |
| `GET /challenges`                             | Listar o catálogo ativo na ordem de exibição. | Público                 |
| `GET /challenges/:challengeId`                | Consultar um Challenge ativo.                 | Público                 |
| `PATCH /admin/challenges/:challengeId/status` | Ativar ou inativar um Challenge.              | `ADMIN` e `SUPER_ADMIN` |

Não criar `POST /challenges` nesta etapa: os 12 itens são um catálogo controlado pelo seeder. Uma rota de criação só deve existir se o produto deixar de trabalhar com um conjunto fixo.

## Integração com Solutions

O relacionamento final será:

```text
Challenge 1 ─── N Solution
```

- `solutions.challengeId` referencia `challenges.id`.
- A criação de Solution exige Challenge existente e `ACTIVE`.
- A listagem `GET /challenges/:challengeId/solutions` retorna apenas Solutions `PUBLISHED`.
- Inativar um Challenge bloqueia novas publicações, mas não apaga seu histórico.
- Excluir fisicamente um Challenge referenciado deve ser impedido por `ON DELETE RESTRICT`.

## TokenCodes necessários

- `CHALLENGE_NOT_FOUND` — já existente.
- `INVALID_CHALLENGE` — já existente.
- `CHALLENGES_LISTED` — sucesso da listagem.
- `CHALLENGE_FOUND` — sucesso da consulta individual.
- `CHALLENGE_STATUS_UPDATED` — sucesso da alteração administrativa.
- `CHALLENGE_STATUS_UNCHANGED` — conflito quando o estado solicitado já está aplicado.

## Ordem das migrations da V2

1. `users`
2. `admin_credentials`
3. `challenges`
4. `solutions`
5. `comments`
6. `likes`

`choices` não aparece na ordem nova porque será apenas uma estrutura legada até sua remoção segura.

## Etapas de implementação

- [ ] Aprovar os nomes, códigos e descrições dos 12 Challenges.
- [ ] Criar `ChallengeStatus`.
- [ ] Criar `ChallengeEntity`.
- [ ] Corrigir a migration de `challenges` conforme o estado do banco.
- [ ] Corrigir `ChallengeModel`.
- [ ] Criar `ChallengeMapper`.
- [ ] Completar `ChallengeRepository` e sua implementação Sequelize.
- [ ] Criar casos de uso de listagem, consulta e mudança de status.
- [ ] Criar DTOs de parâmetros e atualização de status.
- [ ] Criar presenters público e administrativo.
- [ ] Criar controllers públicos e administrativo.
- [ ] Registrar controllers e providers no `ChallengesModule`.
- [ ] Criar o seeder dos 12 itens.
- [ ] Alterar Solutions para validar com `existsActiveById`.
- [ ] Documentar as rotas no Swagger.
- [ ] Executar migrations e seeder em PostgreSQL vazio.
- [ ] Validar integração entre Challenges e Solutions.
- [ ] Criar testes Jest quando a etapa de testes começar.

## Critérios de conclusão

- [ ] Uma base PostgreSQL vazia executa as migrations na ordem correta.
- [ ] O seeder insere exatamente os 12 Challenges sem depender de dados legados.
- [ ] A listagem pública retorna somente Challenges ativos e ordenados.
- [ ] Challenge inexistente retorna `CHALLENGE_NOT_FOUND`.
- [ ] Apenas admin autenticado e com senha atualizada altera o status.
- [ ] Não é possível publicar Solution em Challenge inativo.
- [ ] Inativar Challenge não remove Solutions existentes.
- [ ] Migration e model possuem os mesmos tipos e campos.
- [ ] Typecheck, ESLint e Prettier passam.
