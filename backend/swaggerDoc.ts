import swaggerJSDoc from 'swagger-jsdoc';
import './apiDoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Handi-work API Documentation',
      version: '1.0.0',
      description: 'API documentation for Handi-work endpoint',
    },
    servers: [
      {
        url: 'https://localhost:3000',
      },
    ],
  },
  apis: ['./apiDoc.ts'], // Path to the additional Swagger JSDoc comments
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
