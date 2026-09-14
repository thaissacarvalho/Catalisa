# Plano de migração do back-end

## Objetivo

Concluir a evolução para uma API com Node.js, TypeScript, NestJS, Sequelize e PostgreSQL, com migrations reproduzíveis, testes automatizados, Docker, autenticação e autorização. O trabalho deve preservar regras de negócio válidas e reduzir o acoplamento entre HTTP, domínio e persistência.

## Estado observado

- A migração JavaScript para TypeScript/NestJS está em curso: arquivos antigos foram removidos e substitutos TypeScript ainda não estão rastreados pelo Git.
- Já existem NestJS, Sequelize, `pg`, `bcrypt`, `dotenv` e Swagger como dependências.
- Ainda não há configuração funcional de Jest, Docker, `sequelize-cli`, `nest-cli.json` ou `tsconfig.build.json`.
- No Ubuntu/WSL inspecionado, `node` não está no `PATH`; validações devem rodar com Node Linux, não com executáveis Windows através de caminhos UNC.

## Arquitetura alvo

```text
src/<dominio>/
  application/
    dto/
    use-cases/
    controllers/
  domain/
    entities/
    repositories/
  infrastructure/
    persistence/sequelize/
```

- Controllers recebem DTOs e chamam casos de uso; não acessam Sequelize diretamente.
- Casos de uso dependem de interfaces de repositório.
- Models e mappers ficam na infraestrutura.
- Tokens de injeção são constantes exportadas, não strings repetidas.
- Uma única instância de `Sequelize` é criada pelo Nest e fechada no shutdown.
- Entidades e respostas HTTP não expõem segredos, hashes de senha ou dados internos.

## Fases

### 1. Ambiente e build

1. Instalar e fixar versão LTS de Node no WSL, igual ao CI e Docker.
2. Adicionar `.nvmrc` ou `engines` no `package.json`.
3. Criar `nest-cli.json` e `tsconfig.build.json`; o build deve gerar `dist/`.
4. Criar scripts: `lint`, `format:check`, `typecheck`, `test`, `test:e2e`, `build`, `start:dev`, `db:migrate` e `db:seed`.
5. Instalar `sequelize-cli` ou adotar um script TypeScript para migrations. Escolher apenas um caminho.

Aceite: `npm ci`, `npm run typecheck`, `npm run build` e `npm test` funcionam no WSL sem binários Windows.

### 2. Configuração e segurança

1. Centralizar variáveis em módulo Nest validado no bootstrap.
2. Manter `.env` fora do Git e fornecer `.env.example` sem segredos.
3. Separar desenvolvimento, teste e produção.
4. Validar conexão do banco, JWT, expiração de tokens e custo do bcrypt.
5. Nunca registrar senhas, tokens, autorização ou URL do banco com credenciais.

### 3. PostgreSQL, Sequelize e migrations

1. Criar `docker-compose.yml` com PostgreSQL, volume nomeado, healthcheck e variáveis de `.env`.
2. Padronizar tabelas e colunas em `snake_case`, tabelas plurais, FKs explícitas e timestamps consistentes.
3. Migrations são a fonte de verdade: models devem refletir nomes, tipos, defaults, índices e constraints.
4. Usar `UUID` para a coluna e `UUIDV4` como default; UUID não é auto-incrementável.
5. Incluir `created_at` e `updated_at` ao usar timestamps.
6. Criar constraints de unicidade, nulidade e integridade referencial no banco.
7. Para bases com dados, escrever migrations incrementais e backfill; não editar migration já aplicada.
8. Executar migrations em banco temporário no CI.

Aceite: uma base vazia sobe por Docker, recebe migrations e seed sem erro e coincide com os models.

### 4. Testes e qualidade

1. Configurar Jest para unitários e integração/e2e.
2. Testar casos de uso com mocks ou repositórios em memória.
3. Testar repositórios contra PostgreSQL isolado.
4. Testar controllers e guards por HTTP, inclusive validação, autenticação e autorização.
5. Configurar ESLint e Prettier.

Aceite: fluxos críticos cobrem sucesso, validação, não encontrado, conflito e acesso negado.

### 5. Autenticação e autorização

1. Separar credenciais de dados públicos ou garantir que campos sensíveis nunca sejam selecionados/retornados.
2. Usar bcrypt; nunca armazenar senha em texto ou hash reversível.
3. Implementar login JWT, guard de autenticação e `request.user` tipado.
4. Decidir sobre refresh token; se existir, guardar apenas seu hash, com rotação e revogação.
5. Autorizar por papel e ownership. Não aceitar `userCode` do cliente como prova de identidade.
6. Proteger mudança de status e aplicar rate limit no login.

Aceite: token ausente/inválido é recusado, usuário comum não administra terceiros e segredos não aparecem em respostas/logs.

### 6. Migração incremental

Ordem sugerida para a V2: `users`, `admin_credentials`, `challenges`, `solutions`, `comments`, `likes`. `choices` permanece apenas como legado até sua remoção segura; os 12 temas passam a ser registros de `challenges`.

Para cada domínio: mapear legado, criar DTOs/casos de uso/repositório/testes, migrar schema e dados, publicar rota Nest e só então remover implementação JavaScript.

## Decisões pendentes

- Usuários são contas autenticáveis, perfis públicos ou ambos?
- Quem pode inativar, bloquear ou suspender uma conta?
- Existem dados MySQL a migrar? Qual downtime é aceitável?
- Há contratos HTTP legados que precisam ser compatíveis?
- `userCode` ainda é necessário ou UUID/identidade autenticada o substitui?
- Autorização terá papéis fixos, permissões granulares ou apenas ownership?

## Checklist final

- [ ] Build e typecheck funcionam no WSL, CI e Docker.
- [ ] PostgreSQL sobe por Docker e migrations são reproduzíveis.
- [ ] Há somente uma instância de Sequelize.
- [ ] Models e migrations usam a mesma convenção.
- [ ] Módulos ativos estão em TypeScript e registrados no Nest.
- [ ] Jest cobre unidades, persistência e endpoints críticos.
- [ ] Autenticação e autorização foram testadas.
- [ ] Swagger descreve rotas, DTOs, autenticação e erros.
- [ ] README explica execução, variáveis, migrations e testes.

---

# Guia detalhado de execução

# Guia detalhado de execução da migração

Este guia complementa `migration-plan.md` e transforma cada fase em entregas verificáveis.

## Fase 0: estabelecer uma linha de base

1. Criar branch de migração e registrar o commit inicial antes de novas remoções.
2. Inventariar rotas Express existentes, consumidores, variáveis de ambiente, tabelas MySQL e volume de dados.
3. Executar o legado em ambiente isolado e registrar exemplos de request/response que precisem ser preservados.
4. Definir quais endpoints podem ter breaking changes; se não puderem, versionar (`/v1`, `/v2`) ou criar adaptador temporário.
5. Salvar backup lógico do MySQL antes de qualquer conversão de dados.

Saída: inventário de rotas/tabelas, lista de regras confirmadas e plano de rollback.

## Fase 1: Node, TypeScript e Nest

Configurações a criar ou revisar:

| Item | Requisito |
| --- | --- |
| Node | Versão LTS instalada dentro do Ubuntu/WSL; documentar em `.nvmrc` e `engines`. |
| `nest-cli.json` | Apontar source root para `src` e habilitar build Nest previsível. |
| `tsconfig.build.json` | Estender o tsconfig base, emitir JavaScript e excluir testes. |
| `tsconfig.json` | `strict: true`, decorators Nest, aliases compatíveis com runtime/build; não manter JSX sem necessidade. |
| Scripts | `typecheck`, `build`, `start`, `start:dev`, `test`, `test:e2e`, `db:migrate`, `db:seed`. |
| CI | Rodar instalação limpa, typecheck, build, testes e migrations de teste. |

Verificações: `node --version`, `npm ci`, `npm run typecheck`, `npm run build` e `node dist/main.js` devem funcionar no WSL. Não tratar o sucesso por `npx` Windows como validação do ambiente Linux.

## Fase 2: módulo de configuração

Validar no bootstrap pelo menos:

| Variável | Uso |
| --- | --- |
| `NODE_ENV`, `PORT` | Ambiente e porta da API. |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL. |
| `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN` | Access token. |
| `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN` | Refresh token, se adotado. |
| `BCRYPT_SALT_ROUNDS` | Custo de hash, validado como inteiro seguro. |

Gerar `.env.example` com chaves vazias/valores locais não sensíveis. Separar `test` de `development` para impedir teste contra banco pessoal. Nunca importar `dotenv/config` de forma espalhada; o módulo de configuração é o ponto de leitura.

## Fase 3: PostgreSQL e migrations

### Decisões de schema

- Banco em `snake_case`; TypeScript em camelCase.
- UUID para recursos públicos e todas as FKs devem ter tipo exatamente igual à PK referenciada.
- `created_at` e `updated_at` em todas as entidades mutáveis.
- FK deve declarar comportamento de deleção: `CASCADE` somente quando apagar filhos for a regra; `RESTRICT`/`SET NULL` nos demais casos.
- E-mail e pares de relacionamento que precisam ser únicos devem ter constraint no banco, além da validação na aplicação.

### Procedimento para uma base sem dados importantes

1. Corrigir todas as migrations iniciais antes de rodá-las.
2. Criar banco vazio no PostgreSQL Docker.
3. Aplicar migrations do início ao fim.
4. Aplicar seeders independentes de memória/requests HTTP.
5. Inspecionar schema e rodar teste de integração.

### Procedimento para dados existentes

1. Medir linhas, nulos, duplicados e valores inválidos do MySQL.
2. Criar schema PostgreSQL de staging por migrations novas.
3. Transformar dados, incluindo IDs, enum, datas e encoding.
4. Carregar e comparar contagens por tabela; amostrar FKs e checksums lógicos.
5. Fazer teste de aplicação contra staging.
6. Planejar janela de corte, backup final, import incremental e validação pós-corte.
7. Manter rollback por DNS/versão anterior ou restore, conforme o método escolhido.

Não editar migration aplicada em ambiente compartilhado. Para mudança posterior: adicionar coluna compatível, backfill, trocar leitura/escrita, validar e só então remover campo antigo em migration futura.

## Fase 4: banco via Nest e Sequelize

Criar um único `DatabaseModule` que fornece a conexão Sequelize. Models/repositórios recebem essa conexão pela injeção Nest; nenhum model deve instanciar ou autenticar conexão na importação do arquivo. Modelos são registrados primeiro; associações são aplicadas em um registrador posterior para evitar imports circulares.

Sequência de inicialização desejada:

```text
ConfigModule -> DatabaseModule -> models -> associations -> feature modules -> controllers
```

O shutdown do Nest deve fechar a conexão. `authenticate()` é útil no bootstrap/healthcheck; `sync({ force: true })` e `alter: true` não substituem migrations.

## Fase 5: testes

| Camada | Como isolar | O que validar |
| --- | --- | --- |
| Use case | Mock/repositório em memória | Regras, conflitos, ownership e transições. |
| Repositório | PostgreSQL exclusivo de teste | Campos, índices, FKs, transações e mapeamento. |
| Controller E2E | App Nest + banco de teste | Pipes, HTTP status, guards, filtros e serialização. |

O setup de testes deve aplicar migrations na base de teste e limpar registros em ordem segura. Nunca usar `NODE_ENV=development` para rodar E2E.

## Fase 6: segurança e observabilidade

- Hash de senha com bcrypt e custo configurado; comparar por API bcrypt, não manualmente.
- Access token curto; refresh token opcional, hash persistido e revogável.
- Guard global ou por rota; decorator para usuário atual; guard de roles/ownership separado.
- Limite de tentativas no login e logs estruturados sem credenciais.
- Healthcheck deve informar prontidão de banco sem revelar host/usuário/erro SQL ao público.
- Swagger deve usar bearer auth, exemplos seguros e respostas de erro reais.

## Definição de pronto por módulo

Um módulo só está migrado quando: model e migration coincidem; DTOs validam entrada; controller Nest está registrado; caso de uso não depende de HTTP; repositório não depende do controller; testes unitários/integrados passam; rota tem Swagger; autorização foi definida; seeder é válido; e o handler JavaScript correspondente pode ser removido com segurança.

---


# Decisão de produto: Token como comunidade de soluções

## Proposta consolidada

O Token será uma plataforma aberta de participação em desafios. Haverá exatamente 12 desafios pré-definidos, administrados pelo produto. Um participante escolhe um desafio, publica uma solução com sugestões e dicas, comenta soluções já publicadas e curte soluções de outros participantes.

Exemplo: ao escolher o desafio Liderança, o participante publica uma solução com melhorias e outros participantes podem comentar e curtir essa solução.

A integração com IA foi removida do escopo. Não criar, migrar ou manter endpoint, cliente HTTP, variável de ambiente, serviço Docker ou teste de análise por IA. Remover essas referências quando a refatoração do código começar.

## Modelo de domínio definitivo

Challenge, catálogo fixo de 12, tem muitas Solutions.
Solution, publicação de sugestão, tem muitos Comments e Likes.
User tem muitas Solutions, Comments e Likes.

Consequências: challenges é catálogo, não conteúdo criado livremente por usuário. Solutions pertencem a um challenge e ao autor. Comment e Like pertencem a uma solution. Cada like deve ser único por par usuário e solution. A tabela choices deixa de representar uma entidade de produto separada e deve ser substituída ou migrada para o catálogo challenges, conforme o estado dos dados existentes.

## Papéis mínimos

- Visitante: consulta desafios e soluções públicas.
- Participante autenticado: cria e edita as próprias soluções, comentários e likes.
- Administrador: cadastra ou administra os 12 desafios, modera conteúdo e gerencia usuários.

## Releases revisadas

1. Fundação: WSL, Nest, PostgreSQL, migrations, Docker e testes.
2. Identidade: users, autenticação e papéis.
3. Catálogo: challenges pré-definidos e administração dos 12 itens.
4. Conteúdo: solutions associadas ao challenge e autor.
5. Interação: comments e likes com ownership e moderação.
6. Limpeza: remover choices legado, IA e handlers Express/JavaScript.

---

# Diagnóstico técnico do repositório em 26 de agosto de 2026

## Estado atual

A conversão para Nest e TypeScript está em andamento. Users é o único módulo parcialmente convertido. Likes, Solutions, Comments e Challenges ainda dependem de handlers Express e CommonJS, migrations inconsistentes e models com relações incorretas.

## Impedimentos antes de implementar funcionalidades

1. O WSL não possui Node disponível no PATH. O npm detectado é a instalação Windows, portanto build, testes e typecheck não foram validados de forma confiável no Ubuntu.
2. Não existem nest-cli.json, tsconfig.build.json, Jest, Docker Compose ou script de testes funcional. O script test falha de propósito.
3. O tsconfig atual usa noEmit true; é necessário separar config de typecheck e config de build para gerar dist.
4. Há duas conexões Sequelize: uma global e um provider Nest não registrado. É necessário um DatabaseModule com conexão única.
5. ChallengesModule contém imports vazios e impede compilação TypeScript.
6. Existe arquivo não rastreado chamado barra invertida na raiz do repositório, aparentemente artefato acidental. Ele não foi removido nesta análise.

## Decisões de correção

- Manter userCode como identificador público único e imutável de perfil.
- Usar id UUID internamente em FKs, sessão e autorização.
- Implementar role PARTICIPANT e ADMIN na tabela users.
- Challenge será catálogo de 12 desafios administrados, não conteúdo criado por participante.
- Solution pertence a um challenge e a um usuário. Comment e Like pertencem a uma solution.
- Remover IA, Axios e endpoint de análise do escopo.

## Ordem de correção

1. Preparar Node no WSL, build Nest e testes.
2. Corrigir UsersModule, rotas e provider de banco.
3. Implementar autenticação, roles e ownership.
4. Redesenhar migrations de challenges, solutions, comments e likes.
5. Migrar handlers Express para módulos Nest e remover legado.

---

# Decisões profissionais vigentes

Esta seção prevalece sobre recomendações antigas conflitantes neste documento.

## 1. Produto e escopo

- Token é um monólito modular: uma API NestJS, um banco PostgreSQL e módulos independentes por domínio.
- Existem exatamente 12 challenges de catálogo. Participantes não criam challenges; eles publicam solutions para um challenge.
- IA e choices deixam de ser funcionalidades de produto. Choices somente poderá existir temporariamente durante migração de dados.

## 2. Fronteiras de domínio

| Módulo | Responsabilidade | Não deve conhecer |
| --- | --- | --- |
| Users | Perfil público, e-mail, status, role e userCode. | Hash de senha, JWT e regras de login. |
| Authentication | Credencial de admin, login, troca de senha, JWT e guards. | Campos públicos de perfil além do necessário para validar a conta. |
| Challenges | Catálogo fixo de 12 temas. | Criação de conteúdo por participante. |
| Solutions | Publicação e moderação de soluções. | Transporte HTTP ou Sequelize diretamente no caso de uso. |
| Comments | Comentários em uma solution. | Identidade enviada no body. |
| Likes | Like único por usuário e solution. | Contagem persistida sem necessidade. |

## 3. Decisões de dados

- users contém id, userCode, name, email, role, status e perfil.
- admin_credentials contém user_id único, password_hash, must_change_password e password_changed_at.
- A role permanece em users; credencial não é perfil.
- Todas as chaves primárias e FKs usam UUID. Banco usa snake_case; TypeScript usa camelCase.
- Migrations já aplicadas são imutáveis. Alterações posteriores são migrations incrementais.
- likes possui unique em user_id e solution_id.

## 4. Segurança e contrato HTTP

- userCode é identificador público, nunca prova de autenticação. A autoria vem do JWT.
- Senhas só existem para admin, recebem bcrypt com 12 rounds e nunca entram em logs ou respostas.
- TokenCodes é a fonte única de mensagens: type ERROR ou SUCCESS, code, message e statusCode.
- Respostas seguem success, type, code, message, statusCode e data em casos de sucesso.
- Rotas administrativas exigem JWT, role ADMIN e senha inicial já alterada.

## 5. Qualidade mínima obrigatória

- Prettier com singleQuote e ESLint são executados antes do commit.
- Cada caso de uso crítico possui teste de sucesso, validação, conflito, não encontrado e autorização.
- CI futuro executará format:check, lint, typecheck, test, build e migrations em PostgreSQL temporário.
- Docker é a forma oficial de subir PostgreSQL; Node e npm devem executar dentro do WSL.

## 6. Ordem de implementação

1. Preparar ambiente Linux: Node LTS no WSL, npm ci, Docker PostgreSQL e comandos de qualidade funcionais.
2. Fechar Users e Authentication: separar admin_credentials, bootstrap seguro do primeiro admin e testes de login.
3. Criar catálogo seedado dos 12 challenges e remover dependência funcional de choices.
4. Migrar Solutions com ownership, paginação e moderação por admin.
5. Migrar Comments e Likes com FKs, unique e autorização.
6. Remover handlers Express, IA e modelos/migrations não usados após testes de regressão.

## 7. Método de aprendizagem

Para cada entrega, a implementação seguirá: decisão de regra de negócio, desenho da migration, model e associação, DTO e validação, caso de uso, repositório, controller, testes e revisão de segurança. Assim o projeto avança e cada tecnologia é praticada no contexto correto.

## Próxima entrega recomendada

Separar admin_credentials de users e criar a migration incremental correspondente. Esse passo consolida a fronteira entre perfil, autenticação e autorização antes de migrar conteúdo.
