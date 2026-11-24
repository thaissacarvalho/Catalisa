# Referência da API

Esta referência descreve os controllers atualmente registrados nos módulos NestJS. A especificação interativa gerada pela aplicação está em `http://localhost:3000/docs`.

## Convenções

- Base URL local: `http://localhost:3000`.
- Corpos e respostas usam JSON, exceto `DELETE /likes`, que retorna `204` sem corpo.
- Rotas protegidas exigem `Authorization: Bearer <accessToken>`.
- Campos adicionais aos DTOs são rejeitados.
- UUIDs devem seguir um formato aceito por `class-validator`.
- `userCode` gerado pela API segue `USER_` + 32 caracteres hexadecimais.

### Modelo de identidade

Rotas administrativas autenticam o ator por JWT. Rotas de participante recebem `userCode` no body ou na query e não usam token; o código identifica o usuário, mas não comprova criptograficamente sua identidade. Clientes não devem expor ou registrar `userCode` desnecessariamente.

## Resumo dos endpoints

### Públicos e de participante

| Método | Caminho | Finalidade |
| --- | --- | --- |
| `POST` | `/users` | Cadastrar participante |
| `GET` | `/users/:userCode` | Consultar perfil público |
| `GET` | `/challenges` | Listar desafios ativos |
| `GET` | `/challenges/:challengeId` | Consultar desafio ativo |
| `POST` | `/solutions` | Publicar solução |
| `GET` | `/solutions/:solutionId` | Consultar solução publicada |
| `GET` | `/challenges/:challengeId/solutions` | Listar soluções publicadas do desafio |
| `POST` | `/comments` | Criar comentário ou resposta |
| `GET` | `/comments/:commentId` | Consultar comentário visível |
| `GET` | `/solutions/:solutionId/comments` | Listar comentários da solução |
| `POST` | `/likes` | Curtir solução ou comentário |
| `GET` | `/likes/count` | Contar likes visíveis |
| `DELETE` | `/likes` | Remover like de forma idempotente |

### Autenticação

| Método | Caminho | Acesso | Finalidade |
| --- | --- | --- | --- |
| `POST` | `/authentication/admin/login` | Público | Autenticar admin |
| `GET` | `/authentication/me` | JWT | Consultar identidade autenticada |
| `PATCH` | `/authentication/admin/password` | `ADMIN` ou `SUPER_ADMIN` | Trocar a própria senha |
| `POST` | `/authentication/admin/users/:userCode/promote` | `SUPER_ADMIN` | Promover participante |

### Administração e moderação

Todas exigem JWT, papel `ADMIN` ou `SUPER_ADMIN` e senha inicial já alterada.

Em endpoints de status, `ADMIN` pode ativar, inativar ou republicar, mas não remover diretamente uma solução nem excluir um comentário. Para remoção, deve criar uma solicitação. `SUPER_ADMIN` pode remover diretamente com motivo, gerando auditoria `APPROVED`.

| Método | Caminho | Finalidade |
| --- | --- | --- |
| `PATCH` | `/users/admin/:userCode/status` | Alterar status do usuário |
| `PATCH` | `/admin/challenges/:challengeId/status` | Ativar/inativar desafio |
| `GET` | `/admin/solutions` | Listar soluções para moderação |
| `PATCH` | `/admin/solutions/:solutionId/status` | Remover/republicar solução |
| `PATCH` | `/comments/admin/:commentId/status` | Alterar status de comentário |
| `POST` | `/admin/moderation/removal-requests` | Solicitar remoção |
| `GET` | `/admin/moderation/removal-requests` | Listar solicitações |
| `PATCH` | `/admin/moderation/removal-requests/:requestId/approve` | Aprovar remoção |
| `PATCH` | `/admin/moderation/removal-requests/:requestId/reject` | Rejeitar remoção |

## Payloads

### Usuários

`POST /users`

```json
{
  "name": "Ana Souza",
  "email": "ana@example.com",
  "jobPosition": "Product Manager",
  "enterprise": "Empresa Exemplo"
}
```

Limites: `name` 1–120, `email` 1–320 e válido, `jobPosition` 1–80 e `enterprise` 1–120 caracteres. O e-mail é único.

`PATCH /users/admin/:userCode/status`

```json
{ "status": "SUSPENDED" }
```

Valores: `ACTIVE`, `INACTIVE`, `BLOCKED`, `SUSPENDED`.

### Autenticação

`POST /authentication/admin/login`

```json
{
  "email": "admin@example.com",
  "password": "senha-atual"
}
```

`PATCH /authentication/admin/password`

```json
{
  "currentPassword": "senha-atual",
  "newPassword": "nova-senha-segura"
}
```

A nova senha deve ter pelo menos 8 caracteres, no máximo 72 bytes UTF-8 e ser diferente da atual. O endpoint devolve um token novo; o anterior fica inválido.

### Desafios

`PATCH /admin/challenges/:challengeId/status`

```json
{ "status": "INACTIVE" }
```

Valores: `ACTIVE`, `INACTIVE`.

### Soluções

`POST /solutions`

```json
{
  "userCode": "USER_0123456789abcdef0123456789abcdef",
  "challengeId": "b7cc112b-8e67-4268-aeb6-c0127a3b156f",
  "title": "Comunicação transparente com a equipe",
  "description": "Realizar reuniões semanais para compartilhar decisões e resultados."
}
```

O título tem 3–255 caracteres. A descrição é obrigatória e tem no máximo 5.000. Use o UUID de um desafio ativo e o `userCode` de um `PARTICIPANT` ou `SUPER_ADMIN` ativo. Autor inexistente ou inativo retorna `400 INVALID_USER`. Um papel sem permissão retorna `403 FORBIDDEN`.

`PATCH /admin/solutions/:solutionId/status`

```json
{
  "status": "REMOVED",
  "reason": "Conteúdo incompatível com as regras da comunidade"
}
```

Valores: `PUBLISHED`, `REMOVED`. Para `REMOVED`, `reason` é obrigatório e tem 5–500 caracteres.

Somente `SUPER_ADMIN` pode enviar `REMOVED` diretamente. Para `ADMIN`, a API retorna `409 REMOVAL_REQUIRES_APPROVAL`; use `POST /admin/moderation/removal-requests`.

### Comentários

`POST /comments`

```json
{
  "solutionId": "f8bb726d-221f-417c-bfca-9708ce51eef0",
  "userCode": "USER_0123456789abcdef0123456789abcdef",
  "comment": "Comentário com pelo menos cinquenta caracteres para atender ao contrato atual."
}
```

Para criar uma resposta, acrescente `parentCommentId`. O texto, após `trim`, deve ter 50–280 caracteres. O autor, a solução e o comentário pai precisam estar visíveis; o pai deve pertencer à mesma solução.

`PATCH /comments/admin/:commentId/status`

```json
{
  "status": "EXCLUDED",
  "reason": "Conteúdo incompatível com as regras da comunidade"
}
```

Valores: `ACTIVE`, `INACTIVE`, `EXCLUDED`. O domínio exige motivo para exclusão; quando informado, o DTO aceita 10–500 caracteres.

Somente `SUPER_ADMIN` pode enviar `EXCLUDED` diretamente. `ADMIN` deve abrir uma solicitação de remoção. Comentários `EXCLUDED` não podem ser reativados. Um comentário `INACTIVE` pode voltar a `ACTIVE`.

### Likes

`POST /likes`

```json
{
  "userCode": "USER_0123456789abcdef0123456789abcdef",
  "type": "SOLUTION",
  "targetId": "f8bb726d-221f-417c-bfca-9708ce51eef0"
}
```

Consulta de contagem:

```text
GET /likes/count?type=SOLUTION&targetId=f8bb726d-221f-417c-bfca-9708ce51eef0
```

Remoção:

```text
DELETE /likes?userCode=USER_0123456789abcdef0123456789abcdef&type=SOLUTION&targetId=f8bb726d-221f-417c-bfca-9708ce51eef0
```

`type` aceita `SOLUTION` ou `COMMENT`. A criação e a contagem exigem um alvo visível. A criação e a remoção exigem um usuário ativo com papel `PARTICIPANT` ou `SUPER_ADMIN`. A remoção é idempotente e aceita alvo oculto.

### Solicitações de remoção

`POST /admin/moderation/removal-requests`

```json
{
  "targetType": "COMMENT",
  "targetId": "29538443-d037-4568-a50d-bd9d00b05ee4",
  "reason": "Conteúdo denunciado por violar as regras da comunidade"
}
```

`targetType` aceita `SOLUTION` ou `COMMENT`; o motivo tem 10–500 caracteres. A listagem pode ser filtrada por `status=PENDING`, `APPROVED` ou `REJECTED`.

Tanto a aprovação quanto a rejeição recebem:

```json
{
  "reason": "Justificativa da decisão com pelo menos dez caracteres"
}
```

O revisor não pode ser o solicitante. A aprovação altera a visibilidade do alvo e encerra a solicitação na mesma transação.

## Exemplo de autenticação

```powershell
$login = Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:3000/authentication/admin/login' `
  -ContentType 'application/json' `
  -Body '{"email":"admin@example.com","password":"sua-senha"}'

$headers = @{ Authorization = "Bearer $($login.data.accessToken)" }
Invoke-RestMethod `
  -Method Get `
  -Uri 'http://localhost:3000/authentication/me' `
  -Headers $headers
```

## Respostas e erros

Todas as respostas de sucesso, com exceção do `204`, usam este envelope:

```json
{
  "success": true,
  "type": "SUCCESS",
  "code": "MCODE-S001",
  "message": "User created",
  "statusCode": 201,
  "data": {}
}
```

Erros conhecidos usam `CatalisaCodes` e omitem `data`:

```json
{
  "success": false,
  "type": "ERROR",
  "code": "MCODE-019",
  "message": "Invalid request",
  "statusCode": 400
}
```

Os erros mais comuns na integração são:

| HTTP | Código | Situação |
| --- | --- | --- |
| 400 | `MCODE-019` | Payload, path ou query inválido |
| 401 | `MCODE-007` / `MCODE-023` | Token ausente, inválido ou expirado |
| 403 | `MCODE-004` / `MCODE-025` | Papel insuficiente ou senha inicial ainda não trocada |
| 404 | Código específico do recurso | Recurso inexistente ou não visível |
| 409 | Código específico da regra | Duplicidade ou transição de estado inválida |
| 500 | `MCODE-005` | Falha inesperada sem detalhes internos |

O catálogo completo e autoritativo está em [`src/common/http/catalisa-codes.ts`](../../src/common/http/catalisa-codes.ts).
