# Flow: SolutionsModule

## Criar solução

```mermaid
flowchart TD
    A[POST /solutions] --> B[DTO válido]
    B --> C{Autor existe?}
    C -- não --> E1[404 USER_NOT_FOUND]
    C -- sim --> D{ACTIVE e PARTICIPANT/SUPER_ADMIN?}
    D -- não --> E2[403 FORBIDDEN]
    D -- sim --> F{Challenge ativo existe?}
    F -- não --> E3[404 CHALLENGE_NOT_FOUND]
    F -- sim --> G[Persistir PUBLISHED]
    G --> H[201 SOLUTION_CREATED]
```

## Visibilidade

```mermaid
stateDiagram-v2
    [*] --> PUBLISHED: criação
    PUBLISHED --> REMOVED: remoção aprovada ou direta
    REMOVED --> PUBLISHED: republicação administrativa
```

Consultas públicas retornam somente `PUBLISHED` com autor ativo. `GET /admin/solutions` inclui estados internos e auditoria de moderação.

## Alterar status

- `SUPER_ADMIN` pode remover diretamente, desde que informe motivo; o fluxo cria uma solicitação `APPROVED` e remove a solução na mesma transação.
- `ADMIN` não pode remover diretamente e recebe `REMOVAL_REQUIRES_APPROVAL`; deve abrir uma solicitação de moderação.
- `ADMIN` e `SUPER_ADMIN` podem republicar uma solução removida.
- Solicitar o status atual retorna `SOLUTION_STATUS_UNCHANGED`.
