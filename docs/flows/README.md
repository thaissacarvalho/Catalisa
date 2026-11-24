# Flows

Os flows documentam comportamento em execução: entradas, decisões de negócio, persistência, respostas e falhas esperadas.

## Por objetivo

| Objetivo | Documento |
| --- | --- |
| Entender jornadas de ponta a ponta | [Flows de negócio](./business-flows.md) |
| Entender um módulo específico | [Catálogo por módulo](./modules/README.md) |
| Aprofundar criação, remoção e contagem de likes | [LikesModule](./modules/likes.md) |

## Como ler

- Os diagramas mostram a ordem lógica, não classes que o cliente precisa conhecer.
- Estados em maiúsculas correspondem aos enums atuais do domínio.
- Códigos `MCODE-*` correspondem ao catálogo em [`catalisa-codes.ts`](../../src/common/http/catalisa-codes.ts).
- A [referência da API](../guides/api-reference.md) é a fonte para payloads e paths; os flows são a fonte para sequência e decisões.

Ao alterar uma regra, atualize o flow de negócio e o flow do módulo afetado no mesmo PR.
