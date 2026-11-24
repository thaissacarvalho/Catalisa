# API Collections

Artefatos importáveis para executar as rotas da CATALISA.

## Postman

1. Importe [`catalisa.postman_collection.json`](./catalisa.postman_collection.json).
2. Importe [`local.postman_environment.json`](./local.postman_environment.json).
3. Selecione o environment `CATALISA - Local`.
4. Preencha `adminEmail` e `adminPassword`. Para as rotas de desafios e soluções, use em `challengeId` um UUID retornado por `Challenges > List active challenges`.
5. Execute `Authentication > Admin login`; o script salva `accessToken` automaticamente. Se a senha inicial ainda estiver em uso, preencha `currentPassword` e `newPassword` e execute `Update admin password` antes das operações administrativas.

A collection representa somente controllers registrados nos módulos NestJS: 26 endpoints. Scripts de pós-resposta salvam IDs criados quando a resposta possui o campo esperado.

## Segurança

- Não faça commit de environments com credenciais reais.
- O arquivo local contém apenas placeholders.
- A senha temporária retornada por promoção deve ser tratada como segredo.
- Prefira secrets locais do Postman para valores sensíveis.

## Manutenção

Ao alterar rota, método, payload ou autorização:

1. atualize a collection;
2. atualize `docs/guides/api-reference.md`;
3. atualize o design do módulo e o flow afetado;
4. valide a requisição contra a aplicação real.
