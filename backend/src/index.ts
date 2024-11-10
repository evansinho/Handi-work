import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swaggerDoc';
import routes from './routes/index';
// Testing middlewares
// import roleCheck from './middlewares/roleCheck';
// import { Role } from '@prisma/client';
// import authMiddleware from './middlewares/auth';

export const app = express();
app.use(express.json());

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', routes);
// test middlewares [roleChecker and auth]
// app.get('/admin-dashboard', authMiddleware, roleCheck([Role.ADMIN]), async (req, res) => {
//   try {
//     res.json({ message: 'Welcome to the admin dashboard' });
//   } catch (error) {
//     // Handle unexpected errors
//     console.error(error);
//   }
// });
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
