import {
  Request, Response, Application, NextFunction,
} from 'express';
import asyncHandler from 'express-async-handler';
import { MongoClient } from 'mongodb';
import chalk from 'chalk';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      mongoDbClient?: MongoClient
    }
  }
}

let client: MongoClient | null = null;

async function getOrCreateClient(connectionString: string) {
  if (client === null) {
    console.log(chalk.yellow('  Opening MongoDB connection...'));
    client = await MongoClient.connect(connectionString);
    console.log(chalk.green(`  Connected to ${connectionString}`));
  }
  return client;
}

function closeConnection() {
  if (client !== null) {
    console.log(chalk.yellow('  Closing MongoDB connection...'));
    client.close(true);
    client = null;
  }
}

export async function mongoDbStartMiddleware(app: Application, connectionString: string) {
  return app.use(asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.mongoDbClient = await getOrCreateClient(connectionString);
      return next();
    } catch (error) {
      console.log(chalk.bold.red('  Failed to connect to MongoDB!'));
      next(error);
    }
  }));
}

export async function mongoDbEndMiddleware(app: Application) {
  return app.use(asyncHandler(async () => {
    if (client !== null) client.close();
  }));
}

export function registerMongoGracefulEnding() {
  process.on('SIGTERM', closeConnection);
  process.on('SIGQUIT', closeConnection);
  process.on('SIGINT', closeConnection);
}
