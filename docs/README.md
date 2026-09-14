# Documentação de migração

Este diretório reúne o plano de evolução do back-end para Node.js, TypeScript, NestJS, Sequelize e PostgreSQL. A análise foi feita em 25 de agosto de 2026.

## Documentos

- [Plano de migração](./migration-plan.md): sequência de trabalho, arquitetura, infraestrutura, qualidade e critérios de aceite.
- [Auditoria do módulo Users](./users-refactor.md): achados concretos, correções prioritárias e desenho recomendado para usuários, autenticação e autorização.
- [Migração de Challenges V2](./challenges-migration.md): schema alvo, separação entre migration e seeder, integração com Solutions e critérios de conclusão.

## Ordem recomendada

1. Estabilizar ferramentas, build e ambiente local no WSL.
2. Consolidar PostgreSQL, Sequelize e migrations.
3. Concluir `users` com testes.
4. Introduzir autenticação e autorização.
5. Migrar os módulos restantes e remover o legado somente após cada fluxo estar coberto.

Não aplique migrations antigas em banco PostgreSQL compartilhado sem revisar o histórico e validar primeiro em uma base descartável.
