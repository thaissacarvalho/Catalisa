# Documentação da CATALISA

Esta pasta explica o sistema implementado em `src/`, os fluxos de dados, as decisões arquiteturais e os procedimentos de desenvolvimento. Controllers registrados nos módulos NestJS, DTOs, use cases e migrations são as fontes de verdade.

## Mapa da documentação

```text
docs/
├── designs/      arquitetura atual e endpoints por módulo
├── flows/        fluxos de dados dos principais casos de uso
├── adr/          decisões técnicas aceitas e imutáveis
├── rfc/          propostas antes da implementação
├── collections/  collection e environment Postman
└── guides/       procedimentos de setup, ambiente e operação
```

## Por onde começar

| Necessidade | Documento |
| --- | --- |
| Entender a arquitetura geral | [Designs](./designs/README.md) |
| Entender dependências entre features | [Mapa de dependências](./designs/dependencies.md) |
| Entender uma jornada ponta a ponta | [Flows](./flows/README.md) |
| Testar endpoints manualmente | [Collection Postman](./collections/README.md) |
| Configurar o ambiente | [Environments](./guides/environment.md) |
| Inicializar o projeto | [Setup local](./guides/local-setup.md) |
| Criar o primeiro super-admin | [Scripts operacionais](../scripts/README.md) |
| Inicializar e testar em profundidade | [Tutorial de testes](./guides/testing.md) |
| Propor uma mudança | [RFCs](./rfc/README.md) |
| Consultar uma decisão aceita | [ADRs](./adr/README.md) |

## Estado atual e propostas

- `designs/`, `flows/` e `guides/` descrevem o comportamento atual.
- `adr/` registra por que decisões atuais foram tomadas. ADRs aceitos não são reescritos; uma mudança exige novo ADR que substitua o anterior.
- `rfc/` contém propostas. Uma RFC não representa funcionalidade disponível.
- `collections/` deve conter artefatos importáveis e executáveis, não especificações narrativas.

## Fontes de verdade

| Assunto | Fonte |
| --- | --- |
| Módulos ativos | `src/app.module.ts` |
| Endpoints ativos | Controllers registrados em cada `*.module.ts` |
| Entrada e validação | DTOs e `ValidationPipe` global |
| Regras de negócio | Use cases, entidades e helpers de autorização |
| Persistência | Ports, repositories Sequelize e mappers |
| Schema | `migrations/` |
| Erros e sucessos | `src/common/http/catalisa-codes.ts` |
| Comandos | `package.json` e arquivos Compose |

## Convenções de manutenção

- Documente somente endpoints registrados e acessíveis.
- Separe claramente estado atual de proposta futura.
- Atualize design, flow, testes e collection no mesmo PR que alterar um contrato.
- Use diagramas Mermaid para relações e sequências relevantes.
- Preserve nomes de classes, enums e rotas exatamente como no código.
- Não inclua senhas, tokens ou dados pessoais reais.
