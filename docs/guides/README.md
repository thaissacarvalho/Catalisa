# Guides

Procedimentos para executar, integrar, testar e manter a CATALISA.

| Tarefa | Guide |
| --- | --- |
| Instalar, configurar e executar | [Setup local](./local-setup.md) |
| Entender variáveis de ambiente | [Environments](./environment.md) |
| Criar o primeiro super-admin | [Scripts operacionais](../../scripts/README.md) |
| Consumir endpoints | [Referência da API](./api-reference.md) |
| Inicializar e testar a aplicação em profundidade | [Tutorial de testes](./testing.md) |
| Contribuir com o projeto | [Contribuição](./contributing.md) |

## Limites entre documentos

- Guides explicam **como executar uma tarefa**.
- [Design](../designs/architecture.md) explica **como o sistema é estruturado**.
- [Flows](../flows/README.md) explicam **o que acontece durante uma jornada**.
- [Collections](../collections/README.md) contêm requisições executáveis da API.

## Convenções

- Comandos locais usam PowerShell, coerente com o ambiente principal do projeto.
- Exemplos de API devem usar dados fictícios e nunca conter segredos reais.
- Paths, payloads e permissões devem ser conferidos nos controllers, DTOs e guards.
- Mudanças de comportamento precisam atualizar o guide aplicável e o flow correspondente.
