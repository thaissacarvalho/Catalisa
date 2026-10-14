# Likes: criação, remoção e contagem

## Entrada e identidade

- POST /likes recebe no body: `{ "userCode": "USER_...", "type": "SOLUTION" | "COMMENT", "targetId": "uuid" }`.
- DELETE /likes recebe os mesmos campos na query e retorna 204, mesmo se a curtida não existir.
- GET /likes/count recebe somente `type` e `targetId` na query e retorna a resposta padrão com `data: { count: number }`.

POST e DELETE não exigem Bearer token. Participantes não possuem credenciais; o cliente informa o `userCode` recebido na criação do usuário.
O `userCode` identifica o participante, mas não autentica a requisição. Quem tiver acesso ao código poderá operar curtidas em nome desse participante.

## Responsabilidades

1. DTO de criação/remoção valida `userCode`, enum e UUID; a contagem valida somente o alvo.
2. Helper de aplicação converte type/targetId para LikeTarget.
3. Caso de uso valida se o usuário existe, possui papel `PARTICIPANT` ou `SUPER_ADMIN`, está ativo e, na criação, valida a visibilidade do alvo e a duplicidade.
4. Entity representa a curtida; datas ficam nulas até a persistência.
5. Mapper converte target para uma das duas foreign keys.
6. Repository executa as operações Sequelize e traduz somente conflitos dos índices únicos de usuário/alvo para AppHttpException(TokenCodes.LIKE_ALREADY_EXISTS).
7. Tanto a consulta prévia no caso de uso quanto o conflito no banco retornam o mesmo código, mensagem e status HTTP 409 definidos em TokenCodes.

A verificação prévia de duplicidade não elimina corridas; a proteção final é o índice único.
Uma Solution pública precisa estar publicada e ter autor ativo. Um Comment precisa estar ativo, ter autor ativo e pertencer a uma Solution visível.
Contagens consideram apenas usuários ativos. Remover a própria curtida não exige que o alvo continue visível.

## Respostas

- Criação: 201, LIKE_CREATED.
- Usuário inexistente: 404; `ADMIN` ou usuário inativo: 403.
- Alvo inexistente ou oculto na criação/contagem: 404.
- Curtida duplicada: 409.
- Remoção: 204 sem body.

## Seeder

O seeder cria uma curtida em Solution e uma em Comment, com UUIDs fixos reservados para os dados de exemplo. O rollback remove apenas esses IDs.
