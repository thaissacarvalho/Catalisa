# Variáveis de ambiente

A configuração é carregada por `src/config/environment.ts` com `dotenv` e `env-var`. Variáveis obrigatórias ausentes interrompem o bootstrap.

## Aplicação e banco

| Variável | Obrigatória | Padrão | Uso |
| --- | --- | --- | --- |
| `NODE_ENV` | não | `development` | `development`, `test` ou `production` |
| `APP_HOST` | não | `0.0.0.0` | interface de escuta |
| `APP_PORT` | não | `3000` | porta HTTP |
| `DB_HOST` | sim | — | `localhost` no host; `db` dentro do Compose |
| `DB_PORT` | sim | — | porta PostgreSQL |
| `DB_NAME` | sim | — | nome do banco |
| `DB_USERNAME` | sim | — | usuário do banco |
| `DB_PASSWORD` | sim | — | senha do banco |

## JWT

| Variável | Obrigatória | Padrão | Uso |
| --- | --- | --- | --- |
| `JWT_SECRET` | sim | — | segredo HS256 com no mínimo 32 bytes |
| `JWT_EXPIRES_IN_SECONDS` | não | `28800` | validade do access token |
| `JWT_ISSUER` | não | `token-api` | emissor exigido na validação |
| `JWT_AUDIENCE` | não | `token-admin` | audiência exigida na validação |

## Bootstrap do super-admin

Usadas somente por `npm run admin:bootstrap`:

- `INITIAL_SUPER_ADMIN_NAME`
- `INITIAL_SUPER_ADMIN_EMAIL`
- `INITIAL_SUPER_ADMIN_JOB_POSITION`
- `INITIAL_SUPER_ADMIN_ENTERPRISE`
- `INITIAL_SUPER_ADMIN_PASSWORD`

Todas precisam estar preenchidas. A senha segue os limites do bcrypt: mínimo de 8 caracteres e máximo de 72 bytes UTF-8.

## Ambientes

### Host local

Use `DB_HOST=localhost` quando Node.js estiver no host.

### Docker Compose

O Compose sobrescreve `DB_HOST=db` dentro dos containers e publica apenas a porta da API. O PostgreSQL permanece na rede interna.

### Testes

Testes unitários recebem valores seguros em `test/setup-env.ts`. A integração Docker usa configuração isolada de `docker-compose.test.yml` e banco temporário.

## Segurança

- Nunca versione `.env`.
- Use secret manager em produção.
- Separe segredos de desenvolvimento, testes e produção.
- Rotacione `JWT_SECRET` de forma controlada; tokens existentes serão invalidados.
- Não registre valores de senha, segredo ou token em logs.
