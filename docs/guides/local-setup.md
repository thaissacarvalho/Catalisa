# Setup local

Guia para preparar, executar e diagnosticar a CATALISA. Execute todos os comandos na raiz do repositório.

## Pré-requisitos

| Ferramenta | Requisito | Uso |
| --- | --- | --- |
| Node.js | Versão indicada em [`.nvmrc`](../../.nvmrc) | Runtime e build |
| npm | Distribuído com Node.js | Dependências e scripts |
| Docker Desktop | Engine Linux e Compose v2 | Caminho recomendado e integração |
| PostgreSQL | Opcional | Necessário apenas para execução fora do Docker |

Valide as ferramentas:

```powershell
node --version
npm --version
docker --version
docker compose version
```

## Configuração do ambiente

Instale dependências e crie o arquivo local:

```powershell
npm ci
Copy-Item .env.example .env
```

Preencha pelo menos:

```dotenv
DB_PASSWORD=uma-senha-local
JWT_SECRET=um-segredo-aleatorio-com-pelo-menos-32-bytes
```

Para criar o primeiro super-admin, preencha também as variáveis `INITIAL_SUPER_ADMIN_*`. O `.env` está ignorado pelo Git e não deve ser versionado.

### Variáveis

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `DB_HOST` | sim | — | Host PostgreSQL; `localhost` no host e `db` no Compose |
| `DB_PORT` | sim | — | Porta PostgreSQL |
| `DB_NAME` | sim | — | Nome do banco |
| `DB_USERNAME` | sim | — | Usuário do banco |
| `DB_PASSWORD` | sim | — | Senha do banco |
| `JWT_SECRET` | sim | — | Segredo com no mínimo 32 bytes |
| `NODE_ENV` | não | `development` | `development`, `test` ou `production` |
| `APP_HOST` | não | `0.0.0.0` | Interface de escuta |
| `APP_PORT` | não | `3000` | Porta HTTP |
| `JWT_EXPIRES_IN_SECONDS` | não | `28800` | Expiração do access token |
| `JWT_ISSUER` | não | `catalisa-api` | Emissor validado |
| `JWT_AUDIENCE` | não | `catalisa-admin` | Audiência validada |

## Caminho recomendado: Docker Compose

Suba banco, migrations e API:

```powershell
docker compose up --build -d
docker compose ps
```

O serviço `migrate` aguarda o healthcheck do PostgreSQL e precisa terminar com sucesso antes da API iniciar.

| Serviço | Acesso |
| --- | --- |
| API | `http://localhost:3000` ou porta definida em `APP_PORT` |
| Swagger | `http://localhost:3000/docs` ou a porta definida em `APP_PORT` |
| PostgreSQL | Somente na rede interna do Compose |

Depois que `migrate` terminar com sucesso, carregue os desafios uma vez em um banco local novo:

```powershell
docker compose run --rm migrate npm run db:seed:challenges
```

O seed adiciona 12 desafios ativos. `npm run db:seed` popula também as outras tabelas com dados fictícios. Consulte `GET /challenges` para obter o UUID de um desafio.

Crie o super-admin uma única vez:

```powershell
docker compose --profile bootstrap run --rm bootstrap-admin
```

Comandos operacionais:

```powershell
docker compose logs -f api
docker compose run --rm migrate
docker compose restart api
docker compose down
```

`docker compose down` preserva os dados. `docker compose down -v` apaga o volume PostgreSQL e deve ser usado somente quando os dados puderem ser descartados.

## Caminho alternativo: API no host

1. Inicie um PostgreSQL local e crie banco e usuário.
2. Configure `DB_HOST=localhost` e as demais variáveis no `.env`.
3. Execute:

```powershell
npm run db:migrate
npm run db:seed:challenges
npm run admin:bootstrap
npm run start:dev
```

Para simular produção localmente:

```powershell
npm run build
npm start
```

## Validar a instalação

1. Acesse `http://localhost:3000/docs`.
2. Faça login em `POST /authentication/admin/login`.
3. Se `mustChangePassword` for `true`, use `PATCH /authentication/admin/password`.
4. Use o token novo em `GET /authentication/me`.

O token anterior à troca de senha deve retornar `401`; isso confirma a rotação de credencial.

## Testes

### Unitários

```powershell
npm test
npm run test:watch
npm run test:cov
```

Não exigem PostgreSQL. O relatório HTML de cobertura fica em `coverage/index.html`.

### Integração isolada

```powershell
npm run test:integration:docker
npm run test:integration:docker:down
```

Esse é o caminho recomendado: usa PostgreSQL temporário, aplica todas as migrations e descarta os dados ao final.

### Integração com PostgreSQL local

Use um banco dedicado de teste, nunca o banco de desenvolvimento:

```powershell
npm run test:integration
```

Consulte o [tutorial de testes](./testing.md) para execução seletiva, cobertura, integração, criação de testes e diagnóstico.

## Qualidade antes do PR

```powershell
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:integration:docker
```

## Troubleshooting

| Sintoma | Diagnóstico | Ação |
| --- | --- | --- |
| Processo encerra no bootstrap | Variável obrigatória ausente ou segredo curto | Revise o `.env`; `JWT_SECRET` precisa de 32 bytes |
| API não conecta no banco | Host incorreto ou banco ainda indisponível | Use `db` no Compose e `localhost` no host; confira `docker compose ps` |
| API não inicia após o Compose | Migration falhou | Confira `docker compose logs migrate` e `docker compose run --rm migrate npm run db:migrate:status` |
| Login retorna credenciais inválidas | Bootstrap não executado ou senha incorreta | Execute o perfil `bootstrap` e confira as variáveis iniciais |
| Rota protegida retorna `PASSWORD_UPDATE_REQUIRED` | Credencial temporária ainda ativa | Troque a senha e use o token novo |
| Token antigo retorna `401` | Senha foi alterada | Comportamento esperado; substitua o token |
| Integração falha por estado residual | Banco local foi reutilizado | Prefira a integração Docker ou redefina o banco de teste |
| Porta 3000 ocupada | Outro processo usa a porta | Altere `APP_PORT` ou encerre o processo conflitante |

Para diagnóstico adicional:

```powershell
docker compose logs -f
docker compose run --rm migrate npm run db:migrate:status
npm run typecheck
```
