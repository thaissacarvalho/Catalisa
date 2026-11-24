# RFC 0001: Autenticação de participantes

- Status: Draft
- Criada em: 2026-11-05

## Resumo

Propor autenticação para operações hoje autorizadas apenas por `userCode`, reduzindo a possibilidade de agir em nome de outro participante.

## Contexto

`POST /solutions`, `POST /comments`, `POST /likes` e `DELETE /likes` recebem `userCode` do cliente. O sistema valida existência, papel e status, mas não prova que o chamador controla aquela identidade.

## Objetivos

- autenticar autoria sem expor senha em cada operação;
- derivar `userCode` do token, removendo-o dos payloads de escrita;
- preservar integração atual durante migração controlada;
- manter administração e participação com escopos separados.

## Fora de escopo

- login social;
- recuperação de conta por provedor externo;
- autorização multi-tenant.

## Proposta inicial

1. Criar credencial de participante separada do perfil.
2. Expor login e rotação de refresh token.
3. Introduzir guard de participante.
4. Ler identidade do token nos casos de uso de escrita.
5. Depreciar `userCode` em body/query e removê-lo em uma versão maior.

## Alternativas

- Código de uso único por evento: simples, mas ainda funciona como segredo compartilhado.
- API key por participante: fácil, porém difícil de rotacionar com UX adequada.
- JWT de curta duração com refresh token: maior complexidade, melhor separação de sessão e revogação.

## Impactos esperados

- novos endpoints, tabela de credenciais e migrations;
- mudança incompatível nos DTOs de escrita;
- novos testes de autenticação, revogação e abuso;
- atualização da collection e dos clientes.

## Questões abertas

- participantes definirão senha ou receberão magic link?
- qual canal de recuperação estará disponível?
- qual janela de compatibilidade será oferecida aos clientes existentes?
