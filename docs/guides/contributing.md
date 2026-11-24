# Contribuição

## Fluxo recomendado

1. Entenda o módulo em `docs/designs/modules/` e o caso de uso em `docs/flows/`.
2. Para mudança ainda em discussão, escreva uma RFC antes de implementar.
3. Implemente respeitando a direção de dependências.
4. Crie migration para mudanças de schema.
5. Adicione testes unitários e de integração proporcionais ao risco.
6. Atualize documentação e collection.
7. Execute os gates locais.

## Direção de dependências

```text
controller -> use case -> port de repository
domain     -> não depende de NestJS, HTTP ou Sequelize
adapter    -> implementa o port e conhece Sequelize
```

Controllers não acessam models diretamente. Regras de negócio não devem ficar em decorators, controllers ou repositories.

## Qualidade

```powershell
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:integration:docker
```

## Checklist de pull request

- [ ] o comportamento está coberto por testes;
- [ ] erros conhecidos usam `AppHttpException` e `CatalisaCodes`;
- [ ] inputs passam por DTO e validação;
- [ ] migrations possuem `up` e `down` seguros;
- [ ] respostas não expõem hashes ou campos internos;
- [ ] designs e flows refletem o código;
- [ ] collection foi atualizada se a API mudou;
- [ ] decisão estrutural possui ADR ou RFC aplicável.
