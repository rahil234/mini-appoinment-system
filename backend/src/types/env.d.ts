declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string;

      CORS_ORIGINS?: string;

      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;

      ADMIN_EMAIL?: string;
      ADMIN_PASSWORD?: string;

      NODE_ENV?: 'development' | 'production' | 'test';
      PORT?: string;
    }
}
