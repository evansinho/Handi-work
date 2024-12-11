import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swaggerDoc';
import routes from './routes/index';
import { setupWebSocket } from './services/socket';

export const app = express();
app.use(express.json());

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const httpServer = setupWebSocket(app);

app.use('/api', routes);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
