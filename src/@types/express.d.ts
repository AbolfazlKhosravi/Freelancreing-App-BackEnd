import { UserType } from '../app/models/userAuth-model';

declare global {
  namespace Express {
    interface Request {
      user?: UserType; 
    }
  }
}
