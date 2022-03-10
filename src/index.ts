/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import express from 'express';
import * as core from 'express-serve-static-core';
import { sync as globSync } from 'glob';
import enx from '@enx/env';
import pingMiddleware from './middlewares/ping.middleware';
import security from './middlewares/security';
import logging from './middlewares/logging';
import {
  mongoDbStartMiddleware,
  registerMongoGracefulEnding,
} from './middlewares/mongodb.middlewares';
import openapi from './middlewares/openapi.middlewares';

type Express = core.Express;
// eslint-disable-next-line max-len
const app: Express = express() as Express;

try {
  // === Environment variables
  enx({ cwd: './.env' });

  // === Common middlewares
  /* PING */ pingMiddleware(app);
  /* LOGGING */ const loggingPostCascade = logging(app);
  /* SECURITY */ security(app);
  /* MONGODB */ mongoDbStartMiddleware(app, process.env.MONGODB_URI);

  // === Dynamic controller registration
  const paths = globSync('**/*.controller.js', { cwd: 'dist' });
  const controllers = paths.map(path => require(`./${path}`));
  controllers.forEach(controller => controller.default(app));

  // === OpenAPI Docs
  openapi(app, controllers, process.env.SWAGGER_UI);

  // === Post cascade middlewares
  /* LOGGING */ loggingPostCascade();
  /* 404 FALLBACK */ app.use((req, res) => { res.sendStatus(404); });

  // === Process events and other event listeners
  /* LOGGING */ registerMongoGracefulEnding();
} catch (error) {
  console.error('ERROR INITIALIZING FUNCTION APP ::');
  throw error;
}

export const func = app;
