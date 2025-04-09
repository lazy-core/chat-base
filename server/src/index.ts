import express, { Request, Response } from 'express';

import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Example global endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Node.js Server with TypeScript!');
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});