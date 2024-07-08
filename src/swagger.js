import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Documentación de la API de E-commerce',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(options);

const swaggerRouter = Router();

swaggerRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

export default swaggerRouter;
