import { Request, Response, Application } from 'express';
import asyncHandler from 'express-async-handler';
import { MongoClient } from 'mongodb';

declare global {
  namespace Express {
    export interface Request {
      mongoDbClient?: MongoClient
    }
  }
}

let client: MongoClient | null = null;

async function getOrCreateClient(connectionString: string) {
  if (client === null) {
    client = await MongoClient.connect(connectionString);
  }
  return client;
}

function closeConnection() {
  if (client !== null) {
    client.close(true);
    client = null;
  }
}

export async function mongoDbStartMiddleware(app: Application, connectionString: string) {
  return app.use(asyncHandler(async (req: Request, res: Response) => {
    req.mongoDbClient = await getOrCreateClient(connectionString);
  }))
}

export async function mongoDbEndMiddleware(app: Application) {
  return app.use(asyncHandler(async (req: Request, res: Response) => {
    if (client !== null) client.close();
  }));
}

export function registerMongoGracefulEnding() {
  process.on('SIGTERM', closeConnection);
  process.on('SIGQUIT', closeConnection);
  process.on('SIGKILL', closeConnection);
  process.on('SIGINT', closeConnection);
}
