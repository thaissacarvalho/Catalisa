# ADR 0005: Dois caminhos de moderação

- Status: Accepted
- Data do registro: 2026-11-05

## Contexto

Remoção de conteúdo precisa de auditoria. Administradores comuns não devem remover unilateralmente, enquanto o super-admin precisa atuar diretamente em incidentes.

## Decisão

- `ADMIN` cria uma solicitação `PENDING`, revisada por outro `ADMIN` ou `SUPER_ADMIN`.
- `SUPER_ADMIN` pode remover diretamente; o sistema cria um registro `APPROVED` com o ator como solicitante e revisor.
- aprovação e remoção do alvo acontecem na mesma transação.

## Consequências

- toda remoção possui trilha de auditoria;
- admins precisam de uma segunda pessoa para concluir a remoção;
- o banco precisa impedir pedidos pendentes duplicados e revisão inconsistente;
- repositories de moderação conhecem os models dos alvos para garantir atomicidade.
