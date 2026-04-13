const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkSync Multi-Tenant API',
      version: '1.0.0',
      description: 'Production-ready REST API with Tenant Isolation, RBAC, and Authentication logging.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development environment',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        Unauthorized: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Token is not valid' }
                }
              }
            }
          }
        },
        BadRequest: {
          description: 'Client sent invalid parameters',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Missing required fields.' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] },
    ],
  },
  // Look for swagger JSDocs inside these files
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
