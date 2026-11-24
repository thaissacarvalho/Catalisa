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
  M->>D: inicializa conexão e associações
  N->>N: registra pipes, filters, CORS e Swagger
  N->>H: listen(host, port)
  H-->>P: aplicação disponível
~~~

## Falhas esperadas

- configuração obrigatória ausente: processo não inicia;
- banco indisponível: o bootstrap falha ao autenticar a conexão e o processo não fica disponível;
- erro de validação HTTP: ValidationPipe retorna CatalisaCode padrão;
- erro conhecido: AppHttpExceptionFilter produz envelope consistente.

