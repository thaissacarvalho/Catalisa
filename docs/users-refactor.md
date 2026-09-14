# Módulo Users: auditoria e plano de refatoração

## Escopo

Este documento registra os achados da primeira transação de `users` e define uma sequência segura para torná-lo um módulo Nest confiável. Nenhuma correção descrita foi aplicada durante a auditoria.

## Problemas encontrados

### Críticos

| Achado | Impacto | Correção recomendada |
| --- | --- | --- |
| Migration cria `users`, mas model declara `Users`. | PostgreSQL pode consultar tabela inexistente/diferente. | Padronizar `users` em migration e model. |
| Migration usa `jobPosition`/`userCode`; model tem `underscored: true`, esperando `job_position`/`user_hash`. | Falhas de leitura e escrita por colunas inexistentes. | Usar `snake_case` na migration e mapear atributos camelCase com `field`, de forma consistente. |
| Migration não cria timestamps; model usa `timestamps: true`. | Inserts e queries podem esperar campos ausentes. | Criar `created_at` e `updated_at`, alinhados a `underscored`. |
| `id` usa `DataTypes.UUIDV4` e `autoIncrement: true`. | UUID não é auto-incrementável. | Usar `DataTypes.UUID`, `defaultValue: DataTypes.UUIDV4` e remover `autoIncrement`. |
| `UpdateUserWhere` permite objeto vazio. | `update({}, data)` pode atualizar o primeiro usuário. | Atualizar somente por `id` ou `userCode` obrigatório; preferir `id` da rota/token. |
| Seeder importa `hashStorage` removido e usa `generateUserCode` como default, embora seja export nomeado. | Seed falha. | Corrigir imports e eliminar estado global de hash. |

### Alta prioridade

| Achado | Impacto | Correção recomendada |
| --- | --- | --- |
| Model limita `userCode` a 36; a função gera `HASH_` + 32 hexadecimais = 37. | Persistência pode falhar. | Definir limite correto ou substituir por UUID; manter model e migration iguais. |
| `email` não tem constraint única na migration. | Duplicidade sob concorrência. | Adicionar `UNIQUE` e tratar `UniqueConstraintError` como conflito. |
| Atualização de e-mail não trata colisão. | Erro genérico ou quebra de regra. | Normalizar e-mail e tratar conflito explicitamente. |
| Módulo registra apenas busca por campo. | Criação, listagem e updates não podem ser injetados/expostos. | Registrar todos os providers/controllers necessários. |
| `find-user.controller.ts` declara `FindByUserController`. | Duplicidade de nome e responsabilidade invertida. | Renomear para `FindAllUsersController` e usar rota semântica. |
| Há Sequelize global e provider Nest separados. | Conexões duplicadas e ciclo de vida fora do Nest. | Criar `DatabaseModule` e injetar conexão única. |
| `UserModel` e `Likes` importam-se mutuamente. | Dependência circular na inicialização. | Registrar associações após carregar todos os models. |

## Melhorias de API e domínio

- Substituir `GET /users/findAll` por `GET /users`, com paginação e filtros permitidos.
- Evitar `GET /users/find?field=...&value=...`, que facilita enumeração de dados. Preferir `GET /users/:id` e filtros administrativos específicos.
- Lista vazia retorna `200` com `[]`, não `404`.
- Usar DTOs com `class-validator` e `ValidationPipe` global, não validação manual de query.
- Normalizar e-mail com `trim` e lowercase antes de comparar/persistir.
- Exportar tokens de injeção em vez de repetir `'UserRepository'`.
- Padronizar erros com exception filter; os códigos atuais podem ser mantidos se forem contrato externo.

## Estrutura recomendada

```text
src/users/
  application/
    dto/
    use-cases/
    controllers/users.controller.ts
  domain/
    entities/user.entity.ts
    enums/user-status.enum.ts
    repositories/user.repository.ts
  infrastructure/persistence/sequelize/
    user.model.ts
    sequelize-user.repository.ts
    user.mapper.ts
  users.module.ts
```

## Contratos HTTP sugeridos

| Método e rota | Finalidade | Autorização |
| --- | --- | --- |
| `POST /users` | Criar conta/perfil. | Pública apenas com auto cadastro. |
| `GET /users` | Listar com paginação. | Administrador ou escopo definido. |
| `GET /users/:id` | Consultar usuário. | Próprio usuário ou administrador. |
| `PATCH /users/:id` | Atualizar perfil permitido. | Próprio usuário ou administrador. |
| `PATCH /users/:id/status` | Alterar estado da conta. | Administrador. |
| `POST /auth/login` | Autenticar conta. | Pública. |

`userCode` não deve ser credencial de autorização. Se permanecer como identificador público, seu propósito, índice e limite precisam ser documentados.

## Sequência de implementação

1. Decidir se `users` é uma conta autenticável e onde credenciais/papéis viverão.
2. Definir UUID como identificador canônico; manter ou remover `userCode` por regra explícita.
3. Corrigir a migration antes de aplicá-la a base nova; para base existente, criar migration incremental.
4. Alinhar model e migration em `tableName`, campos, timestamps, tipos e constraints.
5. Consolidar a conexão Sequelize no Nest.
6. Implementar repositório seguro: busca por identificador, paginação e atualização com critério obrigatório.
7. Implementar DTOs, validação de e-mail, limites, enum de status e rejeição de campos extras.
8. Registrar controllers e providers no `UsersModule`.
9. Adicionar testes unitários e de integração.
10. Conectar JWT, papéis e ownership somente após o CRUD estar estável.

## Casos mínimos de teste

- Criação válida com e-mail normalizado.
- Rejeição de e-mail inválido e limites incorretos.
- Conflito para e-mail existente no cadastro e update.
- Retorno por `id` e `404` para inexistente.
- Lista vazia com `200` e coleção vazia.
- Impossibilidade de update sem identificador.
- Usuário comum altera apenas seu perfil.
- Apenas administrador muda status; transições inválidas são recusadas.
- PostgreSQL real valida UUID, índices, `created_at` e `updated_at`.

## Definições pendentes

- O que significam `ACTIVE`, `INACTIVE`, `BLOCKED` e `SUSPENDED`? Quais transições são permitidas?
- `enterprise` e `jobPosition` são livres ou entidades próprias?
- E-mail é obrigatório e será login?
- Cadastro é público ou administrativo?
- Quais campos podem ser visíveis a outros usuários?

---

# Guia detalhado de implementação

# Guia detalhado de implementação: Users

Este guia complementa `users-refactor.md`. A proposta é UUID como chave canônica e identidade vinda do JWT.

## Contrato de dados proposto

| Atributo TypeScript | Coluna PostgreSQL | Observação |
| --- | --- | --- |
| `id` | `id uuid` | PK; não aceitar do cliente no cadastro. |
| `name` | `name varchar(120)` | Trim e limites de negócio. |
| `email` | `email varchar(320)` | Lowercase, unique, nunca duplicar por concorrência. |
| `passwordHash` | `password_hash varchar(255)` | Select explícito no login; omitido no restante. |
| `status` | `status` | Enum/check e default `ACTIVE`. |
| `role` | `role` | Necessário se existir administração. |
| `jobPosition` | `job_position varchar(80)` | Definir opcionalidade. |
| `enterprise` | `enterprise varchar(120)` | Definir opcionalidade. |
| `userCode` | `user_hash varchar(40)` | Apenas se houver uso de negócio independente do token. |
| `createdAt` | `created_at timestamptz` | Gerado no banco. |
| `updatedAt` | `updated_at timestamptz` | Atualizado consistentemente. |

O model Sequelize deve declarar `tableName: 'users'`, fields coerentes e timestamps compatíveis. UUID é `DataTypes.UUID` com `defaultValue: DataTypes.UUIDV4`; jamais `autoIncrement`.

## DTOs e respostas

| Endpoint | Entrada aceita | Campos que nunca podem vir do cliente |
| --- | --- | --- |
| `POST /users` | nome, email, senha e campos de perfil permitidos | id, status, role, userCode, passwordHash. |
| `PATCH /users/:id` | campos editáveis do perfil | status, role, passwordHash, autor. |
| `PATCH /users/:id/status` | somente status válido | quaisquer campos de perfil. |
| `POST /auth/login` | email e senha | role/status/identificadores. |

A resposta pública deve conter no máximo `id`, `name`, `email` quando permitido, perfil, status quando autorizado e datas. Não retornar senha, hash, refresh token, custo bcrypt ou detalhes internos.

## Regras de segurança

1. `POST /users` deve definir status/role no servidor, mesmo que cadastro público exista.
2. A alteração de perfil verifica `currentUser.id === targetUser.id` ou papel administrativo.
3. O status só pode ser alterado em caso de uso administrativo separado.
4. O login rejeita conta bloqueada/suspensa segundo regra explícita e usa mensagem neutra para usuário/senha inválidos.
5. O repositório nunca recebe filtro vazio em update/delete; a assinatura deve exigir `id`.
6. Unique de e-mail é aplicada na migration e o erro do banco vira `409`.

## Fluxo detalhado de cadastro

```text
HTTP DTO -> ValidationPipe -> CreateUserUseCase
  -> normalize email -> verify business rule
  -> bcrypt hash -> repository.create
  -> PostgreSQL unique constraint
  -> public presenter/response
```

Se duas requisições com o mesmo e-mail passarem pela consulta inicial, uma delas ainda deve falhar na constraint única. Esta falha é esperada e deve ser convertida pelo caso de uso/filtro em conflito, não em `500`.

## Fluxo detalhado de login e token

1. Buscar usuário por e-mail normalizado incluindo `password_hash` apenas nesta consulta.
2. Comparar senha com bcrypt, usando resposta neutra se usuário não existir ou senha falhar.
3. Validar status da conta.
4. Assinar access token com `sub = user.id`, papel e claims mínimos; não inserir e-mail/senha desnecessariamente.
5. Se houver refresh token, gerar token aleatório/JWT conforme estratégia, persistir somente hash com expiração e rotação.
6. Logout revoga refresh token/sessão correspondente; access token expira curto.

## Casos de teste obrigatórios

- Cadastro normaliza `Teste@Email.Com ` para `teste@email.com`.
- Cadastro duplicado simultâneo retorna um sucesso e um `409`.
- DTO rejeita `role: ADMIN` e `status: ACTIVE` enviados no cadastro.
- Perfil não contém `passwordHash` em nenhuma rota.
- Usuário A recebe `403` ao editar usuário B.
- Admin altera status; usuário comum recebe `403`.
- Conta bloqueada não emite token.
- Update por ID inexistente retorna `404`; payload vazio retorna `400`.
- Migration cria UUID, e-mail único, timestamps e FKs dependentes compatíveis.

## Perguntas que bloqueiam a implementação final

- Haverá senha local ou autenticação externa?
- E-mail pode mudar? Exige nova verificação?
- O que ocorre com conteúdo de um usuário bloqueado/removido?
- `userCode` precisa continuar público e estável? Para qual consumidor?
- Existe requisito legal de exclusão/anônimização e auditoria?

---


# Papel de Users no produto Token

Users representa a identidade do participante da comunidade. Depois de autenticado, o usuário pode publicar solutions em challenges, comentar solutions e curtir uma solution uma única vez. A autoria nunca vem do body da requisição: vem do usuário atual identificado pelo token.

| Recurso | Relação com usuário | Regra de ownership |
| --- | --- | --- |
| Solution | autor por user_id | autor edita ou remove a própria solution; admin modera. |
| Comment | autor por user_id | autor edita ou remove o próprio comment; admin modera. |
| Like | autor por user_id | usuário cria ou remove somente o próprio like. |
| Challenge | não é autor comum | challenges são catálogo de 12 itens; somente admin administra. |

O status da conta deve afetar participação: contas BLOCKED ou SUSPENDED não podem criar solution, comment ou like. A decisão sobre leitura pública deve ser aplicada nos guards, mas conteúdo já publicado não deve ser apagado automaticamente sem regra de moderação e retenção documentada.

---

# Auditoria da implementação atual de Users em 26 de agosto de 2026

## O que evoluiu corretamente

- UserRepository passou a expor busca explícita por id, userCode e email.
- Update por userCode elimina o risco anterior de filtro where vazio.
- CreateUserUseCase normaliza email no cadastro.
- Model e migration de users passaram a usar UUID, email único, userCode de 40 caracteres e timestamps.
- ValidationPipe global e DTOs com class-validator foram adicionados.

## Problemas que ainda bloqueiam o módulo

| Local | Problema | Correção necessária |
| --- | --- | --- |
| UsersModule | Importa UpdateUserUseCase, mas o arquivo exporta UpdateByUserCodeUseCase. | Corrigir nome do import ou export da classe. |
| UsersModule | Registra somente criação, listagem geral e busca por userCode. | Registrar controllers de update e decidir quais buscas são públicas. |
| Controllers de busca | Existem GET users por id, userCode e email usando a mesma rota dinâmica com um único parâmetro. | Usar rota pública GET users por userCode e deixar busca por email somente no login ou rota admin. Não registrar rotas dinâmicas concorrentes. |
| Controller de status | Injeta use case de update comum, usa UpdateUserDto e chama método inexistente. | Injetar UpdateUserStatusUseCase e receber UpdateUserStatusDto. |
| Busca por id | Retorna null sem converter para 404. | Caso de uso/controller deve lançar USER_NOT_FOUND. |
| Criação | Documentada como resposta OK. | Retornar e documentar status 201. |
| Update de email | Normaliza email, mas não trata email pertencente a outro usuário nem UniqueConstraintError. | Verificar conflito e converter constraint do banco em 409. |
| Listagem geral | Retorna todos os usuários sem paginação. | Criar page, limit, ordenação e proteger como rota admin. |
| Entity/model | Ainda não contém role ou passwordHash. | Adicionar somente quando o fluxo de admin/auth for implementado. |
| Conexão Sequelize | UserModel importa conexão global; provider DATABASE_CONNECTION não está em módulo. | Migrar para DatabaseModule único antes de integrar outros módulos. |

## Rotas recomendadas para esta fase

| Método | Rota | Acesso |
| --- | --- | --- |
| POST | /users | cadastro público ou criação interna, conforme decisão final |
| GET | /users/:userCode | perfil público, se necessário |
| PATCH | /users/:userCode | próprio usuário ou admin |
| PATCH | /users/:userCode/status | somente admin |
| GET | /admin/users | somente admin, com paginação |
| POST | /auth/login | admin e futuros usuários com credencial |

A rota por email não deve ser pública. E-mail deve ser usado em login e em consultas administrativas protegidas.

## Critério para iniciar autenticação

Antes de criar JWT, o módulo deve compilar, UsersModule deve registrar os providers corretos, as rotas devem ser não ambíguas, e o banco deve expor uma conexão única. Depois disso, adicionar role, passwordHash, login e guard de ownership sem reescrever o CRUD novamente.
