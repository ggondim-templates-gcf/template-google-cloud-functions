/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import express from 'express';
import * as core from 'express-serve-static-core';
import { sync as globSync } from 'glob';

type Express = core.Express;
// eslint-disable-next-line max-len
const app: Express = express() as Express;

// app.use((req, res, next) => {
//   res.statusCode = 404;
//   next();
// });

const caminhos = globSync('**/*.controller.js', { cwd: 'dist' });
const controllers = caminhos.map(caminho => require(`./${caminho}`).default);

controllers.forEach(controller => controller(app));

export const func = app;
