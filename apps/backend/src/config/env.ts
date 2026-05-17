import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoose: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/gigflow',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_key_123',
  },
};
