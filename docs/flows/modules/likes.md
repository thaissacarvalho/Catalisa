# Flow: LikesModule

## Criar

```mermaid
sequenceDiagram
    participant C as Cliente
    participant UC as CreateLikeUseCase
    participant U as UserRepository
    participant V as TargetVisibility
    participant R as LikeRepository
    C->>UC: userCode + type + targetId
    UC->>U: buscar usuário
    UC->>UC: exigir ACTIVE e PARTICIPANT/SUPER_ADMIN
    UC->>V: exigir alvo visível
    UC->>R: buscar duplicidade
    alt like existente
        UC-->>C: 409 LIKE_ALREADY_EXISTS
    else novo like
        UC->>R: INSERT
        R-->>C: 201 LIKE_CREATED
    end
```

A consulta prévia melhora a mensagem, mas a garantia contra concorrência vem dos índices únicos no PostgreSQL.

## Remover

`DELETE /likes` valida usuário, papel e status, mas não exige que o alvo continue visível. O repository apaga se existir e a resposta é sempre `204`, tornando a operação idempotente.

## Contar

`GET /likes/count` exige alvo visível e conta somente likes de usuários ativos. O resultado usa `data: { count }` no envelope padrão.

## Identidade

As rotas de like não usam JWT. O `userCode` identifica o ator, mas não comprova sua identidade; consulte a observação de segurança nos [flows de negócio](../business-flows.md#2-entrada-do-participante).
