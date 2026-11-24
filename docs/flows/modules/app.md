# Flow: AppModule

## Inicialização da aplicação

~~~mermaid
sequenceDiagram
  participant P as Processo
  participant N as NestFactory
  participant M as AppModule
  participant D as DatabaseModule
  participant H as HTTP Server
  P->>N: bootstrap()
  N->>M: create(AppModule)
  N->>N: registra pipes, filters, CORS e Swagger
  P->>N: listen(host, port)
  N->>D: onModuleInit: associações e autenticação do banco
  N->>H: abre a porta HTTP
  H-->>P: aplicação disponível
~~~

## Falhas esperadas

- configuração obrigatória ausente: processo não inicia;
- banco indisponível: o bootstrap falha ao autenticar a conexão e o processo não fica disponível;
- erro de validação HTTP: ValidationPipe retorna CatalisaCode padrão;
- erro conhecido: AppHttpExceptionFilter produz envelope consistente.

