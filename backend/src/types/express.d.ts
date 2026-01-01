import { UserRole } from '@/types';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
      };
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export {};
