import { User } from '@gigflow/shared';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
