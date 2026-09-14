# Token API

Back-end da plataforma Token, criada para apoiar a participação em desafios de eventos: participantes escolhem um challenge, publicam soluções, comentam e curtem contribuições.

## TokenCodes: erros e sucessos

A API usa TokenCodes como catálogo único de mensagens. Cada item possui type ERROR ou SUCCESS e um MCODE estável para o cliente. Respostas de erro seguem este formato:

    {
      "success": false,
      "type": "ERROR",
      "code": "MCODE-022",
      "message": "Invalid admin credentials",
      "statusCode": 401
    }

## Códigos de conteúdo e requisição

Os códigos abaixo fazem parte da V2. Em código novo, use TokenCodes por meio de AppHttpException; nunca retorne strings de erro diretamente.

| Código | Nome | HTTP | Uso |
| --- | --- | --- | --- |
| MCODE-029 | INVALID_USER_IDENTIFIER | 400 | id ou userCode inválido ou ausente. |
| MCODE-030 | INVALID_PERSISTENCE_DATA | 400 | Dados obrigatórios ausentes para persistir um recurso. |
| MCODE-031 | SOLUTION_QUERY_FAILED | 500 | Falha inesperada ao consultar soluções. |
| MCODE-032 | SOLUTION_CREATION_FAILED | 500 | Falha inesperada ao criar uma solução. |
| MCODE-033 | COMMENT_QUERY_FAILED | 500 | Falha inesperada ao consultar comentários. |

A ausência de um recurso não é falha técnica: use os códigos específicos de não encontrado, como SOLUTION_NOT_FOUND ou COMMENT_NOT_FOUND, com HTTP 404.

## Scripts

    npm run format
    npm run format:check
    npm run lint
    npm run lint:fix
    npm run typecheck

## Autenticação administrativa

1. Copie `.env.example` para `.env` e substitua todos os valores de exemplo.
2. Gere `JWT_SECRET` com um gerador criptograficamente seguro e use pelo menos
   32 bytes. A aplicação recusa iniciar sem esse segredo ou com um valor curto.
3. Execute as migrations e crie o primeiro super-admin uma única vez:

       npm run admin:bootstrap

4. Faça login em `POST /authentication/admin/login`. Envie o token retornado
   como `Authorization: Bearer <token>` nas rotas protegidas.
5. Enquanto `mustChangePassword` for `true`, troque a senha em
   `PATCH /authentication/admin/password`. Use o novo token retornado; os tokens
   anteriores à troca deixam de ser aceitos.

O token administrativo expira por padrão em 8 horas. `JWT_ISSUER`,
`JWT_AUDIENCE` e o algoritmo HS256 são validados, e cada requisição protegida
reconfirma no banco que o usuário continua ativo, com o mesmo papel e a mesma
versão de credencial.

### Permissões

- `SUPER_ADMIN`: pode trocar a própria senha e promover participantes.
- `ADMIN`: pode autenticar e trocar a própria senha.
- `PARTICIPANT`: não recebe credencial administrativa.

O bootstrap e as promoções armazenam somente hashes bcrypt (custo 12). Senhas
devem ter pelo menos 8 caracteres e no máximo 72 bytes UTF-8; a limitação superior
evita truncamento silencioso
do bcrypt. O arquivo `.env` já está ignorado pelo Git e não deve ser versionado.

Em produção, aplique rate limiting no endpoint de login no gateway/reverse proxy,
use HTTPS obrigatório e mantenha `JWT_SECRET` em um gerenciador de segredos.
