import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'gigflow-backend' });
});

// Setup routes here
