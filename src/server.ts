import 'dotenv/config';
import { createServer } from 'node:http';
import { createApp } from './api/app';
import { env } from './api/lib/env';
import { prisma } from './api/lib/prisma';

const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  console.log(`TaskFlow API listening on http://localhost:${env.port}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
