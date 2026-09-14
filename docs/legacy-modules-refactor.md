# Auditoria dos módulos legados

## Relações a padronizar

O desenho alvo deve escolher uma convenção única: `user_id` para todas as referências a usuários, `choice_id` para opções e `solution_id` para comentários e likes. Hoje os arquivos alternam entre `userId`, `userCode`, `choice`, `choiceId`, `choicesId`, `uri`, `uri_choice`, `solutionId` e `id`, o que impede integridade confiável.

```text
User 1 ── * Solution
User 1 ── * Comment
User 1 ── * Like
User 1 ── * Challenge
Choice 1 ── * Solution
Choice 1 ── * Challenge
Solution 1 ── * Comment
Solution 1 ── * Like
```

## Problemas transversais

- Os models usam `timestamps: true`, mas migrations de solutions, comments, likes e challenges não criam timestamps.
- A configuração Sequelize usa `underscored`, enquanto migrations usam nomes camelCase.
- Há imports circulares entre User, Solution, Like, Comment e Choice; declarar associações depois de carregar todos os models.
- Seeders omitem FKs obrigatórias e ainda dependem de `hashStorage`, removido do projeto.
- Arquivos TypeScript ainda contêm handlers Express/CommonJS; devem ser reescritos como controllers Nest, DTOs e casos de uso.

## Likes

### Achados

- `newLike.js` busca e cria com `id`, que é PK do like, quando deveria usar `solutionId`.
- A criação grava `id` no lugar de `solutionId`.
- `Likes.belongsTo(Solutions)` usa `foreignKey: 'id'`, em vez de `solutionId`.
- Não há constraint única para usuário e solução; o toggle pode criar likes duplicados em concorrência.
- O seeder cria ID como string, não define `solutionId` e importa arquivo removido.

### Refatoração

- Preferir `POST /solutions/:solutionId/likes` e `DELETE /solutions/:solutionId/likes`.
- Obter autor do JWT, nunca de `userCode` enviado no body.
- Criar `UNIQUE (solution_id, user_id)` e FKs para solution e user.
- Retornar `201` na criação, `204` na remoção e `404` para solução inexistente.

## Solutions

### Achados

- Migration cria `solutionId` e `choicesId`, enquanto model declara `userId` e `choiceId`.
- `solutionId` na migration não é FK; não existe FK para usuário, e `users.id` já é UUID, não inteiro.
- `Solutions.hasMany(Users, { foreignKey: 'id' })` está com cardinalidade/chave incorretas; em geral solução pertence a usuário.
- `getSolutions.js` filtra por `{ id: idChoice }`, não por choice; conta likes/comments por `{ id: solution.id }`, não por `solutionId`.
- Há duas queries de contagem por solução, criando N+1.
- O seeder omite campos obrigatórios da migration.

### Refatoração

- Definir schema coerente: `solutions(id, user_id?, choice_id, title, description, created_at, updated_at)`.
- Expor `GET /choices/:choiceId/solutions` com paginação.
- Calcular contagens por agregação, não por N+1.

## Comments

### Achados

- Controller TypeScript contém CommonJS/Express e import relativo incorreto para models.
- Busca comentários por `{ id: solution.id }`, em vez de `{ solutionId: solution.id }`.
- Associação `Comments.belongsTo(Solutions)` usa `foreignKey: 'id'`.
- `userId` é inteiro no model/migration e incompatível com UUID de users.
- No fluxo `newChallenge.ts`, comentário recebe campos inexistentes (`userCode`, `choice`) e usa `id` onde deveria usar `solutionId`.
- Migration não cria timestamps; seeder não fornece `solutionId` ou `userId` obrigatórios.

### Refatoração

- Implementar `POST/GET /solutions/:solutionId/comments`, e edição/exclusão por `/comments/:id` se forem requisitos.
- Extrair `user_id` do JWT e `solution_id` da rota.
- Definir limite de texto, paginação e ownership: somente autor ou moderador edita/remove.

## Challenges

### Achados

- `challenges.module.ts` tem imports vazios e não registra controller/provider; não é módulo Nest funcional.
- O controller é handler Express/CommonJS e compartilha criação de comentário e challenge via `data.type`.
- Cria usuário sob demanda com dados do body e `userCode`, permitindo forjar identidade.
- Consulta `user.nome`, mas o model usa `name`.
- FK da choice alterna entre `uri_choice` e `uri`; o model Choices só declara `uri`.
- Migration não possui timestamps; `userCode` mantém uma relação textual frágil com users.

### Refatoração

- Separar `CommentsController` de `ChallengesController`.
- Implementar CRUD de challenges somente conforme requisito de produto.
- Definir autor pelo JWT e choice por `choice_id`, nunca por hash/URI controlados pelo cliente.
- Decidir visibilidade, moderação, edição e exclusão antes da implementação.

## Choices: pré-requisito

`choices` precisa estabilizar primeiro: migration cria `name` e `uri`, mas handlers consultam `uri_choice` e `choice_name`; `Choices.hasMany(Solutions)` usa `foreignKey: 'id'` em vez de `choice_id`; e timestamps também não estão alinhados. Recomenda-se catálogo com `id`, `name`, `uri` único e timestamps.

## Ordem segura

1. Fixar IDs, tabelas, timestamps e `choices`.
2. Concluir users e autenticação.
4. Migrar comments com ownership.
5. Migrar likes com constraint única.
6. Migrar challenges separado de comments.
7. Recriar seeders com FKs válidas e testes de integração.

---

# Guia detalhado de implementação

# Guia detalhado de implementação: módulos legados

Este guia complementa `legacy-modules-refactor.md` com um contrato técnico para transformar os handlers Express em módulos Nest.

## Models e associações alvo

| Relação | Atributo no model | Coluna |
| --- | --- | --- |
| Solution -> Choice | `choiceId` | `choice_id` |
| Solution -> User (se houver autor) | `authorUserId` | `author_user_id` |
| Comment -> Solution | `solutionId` | `solution_id` |
| Comment -> User | `userId` | `user_id` |
| Like -> Solution | `solutionId` | `solution_id` |
| Like -> User | `userId` | `user_id` |
| Challenge -> Choice | `choiceId` | `choice_id` |
| Challenge -> User | `userId` | `user_id` |

Declarar associações após registrar todos os models. O `foreignKey` é o atributo FK (`solutionId`), não `id`.

## Ordem de migrations e seeders

1. `choices` com `uri` único e timestamps.
2. `users` com UUID e status.
3. `solutions` referenciando choice e autor se necessário.
4. `comments` e `likes` referenciando solution/user.
5. `challenges` referenciando choice/user.
6. Seeders na mesma ordem, sempre com FKs reais e nunca com estado global em memória.

Para cada migration, incluir `created_at` e `updated_at`, FKs nomeadas, índices de filtros frequentes e `down` que respeite dependências. No Postgres, FKs de users devem ser UUID.

## Módulos Nest mínimos

| Módulo | Controllers | Use cases |
| --- | --- | --- |
| Choices | `ChoicesController` | list, get, create/update admin. |
| Solutions | SolutionsController | list, get, create, update. |
| Comments | `CommentsController` | list by solution, create, update own, delete own. |
| Likes | `LikesController` | create, remove, count. |
| Challenges | `ChallengesController` | list, get, create, update own, delete own. |

Cada módulo importa o DatabaseModule e os módulos de dependências necessários. Evitar import direto de arquivo de model de outro módulo no caso de uso; a dependência cruzada deve ficar no repositório/associação ou por interface quando necessário.

## Queries corretas que substituem o legado

| Necessidade | Filtro correto |
| --- | --- |
| Soluções de uma choice | `where: { choiceId }`, não `{ id: choiceId }`. |
| Comentários de solução | `where: { solutionId }`, não `{ id: solutionId }`. |
| Likes de solução | `where: { solutionId }`, não `{ id: solutionId }`. |
| Like do usuário atual | `where: { solutionId, userId: currentUser.id }`. |

Contagens de comentários/likes devem usar agregação ou consulta agrupada. Não usar `Promise.all` que executa duas contagens para cada solução quando a listagem pode crescer.

## Autorização por módulo

| Recurso | Criar | Alterar/remover |
| --- | --- | --- |
| Solution | Autenticado ou admin, conforme produto | Autor ou admin. |
| Comment | Autenticado | Autor ou moderador/admin. |
| Like | Autenticado | Somente autor do próprio like. |
| Challenge | Autenticado | Autor ou moderador/admin. |
| Choice | Admin | Admin. |

O autor sempre vem do JWT. O body não aceita `userId`, `userCode` ou `authorUserId` para estabelecer ownership.

## Critérios por módulo

Um módulo está pronto quando sua migration/model/associações coincidem; DTOs rejeitam campos indevidos; FK e unique constraints cobrem integridade; rota está no Swagger; regras de ownership são testadas; listagens são paginadas; seed é reproduzível; e o handler JavaScript foi removido sem consumidor ativo.

---


# Direção final dos módulos de conteúdo

Esta seção substitui alternativas anteriores que tratavam IA, choices e challenges como domínios independentes ou conteúdo criado livremente.

## Challenge é catálogo fixo

O produto terá 12 challenges, por exemplo Liderança. Cada desafio deve ter ID estável, nome, slug único, descrição e ordem de exibição. O participante não cria challenge; ele escolhe um challenge para publicar uma solution. Portanto, o handler legado newChallenge não deve ser migrado como endpoint de criação por participante. Sua responsabilidade deve ser dividida entre administração de catálogo e criação de solutions.

| Tabela | Campos essenciais | Regra |
| --- | --- | --- |
| challenges | id, name, slug, description, display_order, is_active, timestamps | 12 itens seedados; slug e display_order únicos. |
| solutions | id, challenge_id, user_id, title, content, timestamps | FK para challenge e user; conteúdo publicado por participante. |
| comments | id, solution_id, user_id, content, timestamps | Comment pertence a uma solution. |
| likes | id, solution_id, user_id, timestamps | Unique por solution_id e user_id. |

## Rotas do produto

| Método | Rota | Papel |
| --- | --- | --- |
| GET | /challenges | público |
| GET | /challenges/:slug | público |
| GET | /challenges/:challengeId/solutions | público |
| POST | /challenges/:challengeId/solutions | participante |
| PATCH e DELETE | /solutions/:id | autor ou admin |
| GET e POST | /solutions/:solutionId/comments | leitura pública; criação autenticada |
| PATCH e DELETE | /comments/:id | autor ou admin |
| POST e DELETE | /solutions/:solutionId/likes | participante |
| POST e PATCH | /admin/challenges | admin |

## Itens a remover do legado

- getIASolutions.js, cliente HTTP e URL local da IA.
- Endpoint que recebe type para escolher entre comment e challenge.
- Criação automática de user pelo payload de conteúdo.
- choices como conceito paralelo, depois de migrar dados úteis para challenges.
- Uso de userCode para decidir autor, like ou acesso.

## Seed dos 12 desafios

Criar seeder determinístico com os 12 desafios, slugs únicos e ordem explícita. O seeder deve ser idempotente ou rodar somente em desenvolvimento, conforme a ferramenta escolhida. A lista real dos 12 nomes deve ser aprovada antes de codificar; Liderança é um exemplo confirmado, não uma lista completa.
