import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import * as morgan from './middlewares/morgan';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorConverter, errorHandler } from './middlewares/errorMiddleware';
import { ApiError } from './utils/ApiError';
import { httpStatus } from './constants/httpStatus';
import routes from './routes';
import { API_PREFIX } from '@gigflow/shared';

export const app: Express = express();

if (env.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to endpoints
if (env.env === 'production') {
  app.use(API_PREFIX, apiLimiter);
}

// v1 api routes
app.use(API_PREFIX, routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Route not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
