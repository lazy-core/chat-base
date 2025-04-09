import express, { Request, Response } from 'express';

import { startMongoDB } from "./lib/db";

import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Example global endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Node.js Server with TypeScript!');
});

app.use('/user', userRoutes);

async function startServer() {
  await startMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();