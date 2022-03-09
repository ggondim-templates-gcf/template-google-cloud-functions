/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import express from 'express';
import * as core from 'express-serve-static-core';
import { sync as globSync } from 'glob';
import pingMiddleware from './middlewares/ping.middleware';
import security from './middlewares/security';
import logging from './middlewares/logging';
import {
  mongoDbStartMiddleware,
  registerMongoGracefulEnding,
} from './middlewares/mongodb.middlewares';

type Express = core.Express;
// eslint-disable-next-line max-len
const app: Express = express() as Express;

// === Common middlewares
/* PING */ pingMiddleware(app);
/* LOGGING */ const loggingPostCascade = logging(app);
/* SECURITY */ security(app);
/* MONGODB */ mongoDbStartMiddleware(app, 'CONNECTION_STRING');

// === Dynamic controller registration
const paths = globSync('**/*.controller.js', { cwd: 'dist' });
const controllers = paths.map(path => require(`./${path}`).default);
controllers.forEach(controller => controller(app));

// === Post cascade middlewares
/* LOGGING */ loggingPostCascade();
/* 404 FALLBACK */ app.use((req, res) => { res.sendStatus(404); });

// === Process events and other event listeners
/* LOGGING */ registerMongoGracefulEnding();

export const func = app;
