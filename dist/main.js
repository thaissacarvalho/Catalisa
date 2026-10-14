"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const app_http_exception_1 = require("./common/http/app-http.exception");
const token_codes_1 = require("./common/http/token-codes");
const app_http_exception_filter_1 = require("./common/http/filters/app-http-exception.filter");
const environment_1 = require("./config/environment");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new app_http_exception_filter_1.AppHttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: () => new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_REQUEST),
    }));
    app.enableCors();
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Token API')
        .setDescription('Documentação da API Token')
        .setVersion('2.0')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, swaggerDocument);
    await app.listen(environment_1.environment.app.port, environment_1.environment.app.host);
}
void bootstrap();
//# sourceMappingURL=main.js.map