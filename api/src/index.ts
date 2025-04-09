import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Example endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the API Node.js Server with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});