import { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Reveal BI Service')
    .setDescription(
      `### REST
Routes is following REST standard`,
    );

  documentBuilder.addTag('Reveal BI');
  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  if (process.env.POSTMAN_CONFIG_ENABLED == 'true') {
    documentBuilder.setExternalDoc('Postman Collection', '/documentation-json');
  }

  documentBuilder.addBearerAuth(
    {
      description: 'Please add the token in following format : <jwt_token>',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    },
    'access-token',
  );

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  Logger.warn(
    `Documentation: http://localhost:${process.env.SERVICE_PORT}/documentation`,
  );
}
