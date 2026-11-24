# ADR 0004: JWT administrativo com versão de credencial

- Status: Accepted
- Data do registro: 2026-11-05

## Contexto

Administradores precisam autenticar, trocar senha temporária e perder acesso imediatamente quando papel, status ou credencial mudarem. Um JWT validado apenas por assinatura continuaria válido até expirar.

## Decisão

Emitir JWT HS256 com issuer, audience, expiração, papel, `mustChangePassword` e `credentialVersion`. Em cada requisição protegida, `JwtAuthGuard` reconfirma usuário e credencial no banco. `passwordChangedAt` funciona como versão.

## Consequências

- troca de senha invalida tokens anteriores;
- desativação ou mudança de papel tem efeito imediato;
- cada requisição administrativa consulta o banco;
- indisponibilidade do banco impede autenticação;
- o segredo deve ser forte, protegido e rotacionado operacionalmente.
