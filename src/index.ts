import express from 'express';
import * as core from 'express-serve-static-core';

type Express = core.Express;

// Create an Express object and routes (in order)
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unnecessary-type-assertion
const app: Express = express() as Express;

debugger;

app.use((req, res, next) => {
  res.statusCode = 404;
  next();
});

app.use((req, res) => {
  debugger;
  res.send({ ok: true });
});

export const func = app;
