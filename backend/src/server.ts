import { createApp } from '@/app';
import { connectDatabase } from '@/config/prisma.config';

const bootstrap = async () => {
  const app = await createApp();

  await connectDatabase();

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('Server started on port: ', port);
  });
};

bootstrap();
