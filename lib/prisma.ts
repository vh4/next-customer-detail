import { PrismaClient } from "@prisma/client";
import logger from "./logger";

export const prisma = new PrismaClient({
    log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
    ]
});

export async function initDB(): Promise<void> {
  try {
      await prisma.$connect();
      logger.info('Prisma client connected successfully');
  } catch (error) {
      logger.error('Error connecting Prisma client:', error);
  }
}

prisma.$on('error', (e) => {
    logger.error(e.message);
});

prisma.$on('warn', (e) => {
    logger.warn(e.message);
});

prisma.$on('info', (e) => {
    logger.warn(e.message);
});

prisma.$on('query', (e) => {
    logger.warn(e.query);
});