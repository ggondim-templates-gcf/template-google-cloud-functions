import {
  Application, Request, Response, NextFunction,
} from 'express';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import morgan from 'morgan';
import { v6 as uuid } from 'uuid-with-v6';

export default (app: Application) => {
  const { NODE_ENV } = process.env;

  let bugsnag;

  if (NODE_ENV === 'production') {
    Bugsnag.start({
      apiKey: process.env.BUGSNAG_KEY,
      plugins: [BugsnagPluginExpress],
    });
    bugsnag = Bugsnag.getPlugin('express');
    app.use(bugsnag.requestHandler);
    app.use((req, res, next) => {
      const reqId = uuid();
      req.bugsnag?.addMetadata('request', { id: reqId });
      next();
    });
  } else {
    app.use(morgan('dev'));
  }

  return () => {
    // post middleware cascade
    if (NODE_ENV === 'production') {
      app.use(bugsnag.errorHandler);
    }
    app.use((err, req: Request, res: Response, next: NextFunction) => {
      if (err) {
        let reqId = '';
        if (NODE_ENV === 'production') {
          reqId = req.bugsnag
            ? req.bugsnag.getMetadata('request', 'id') as string
            : 'unknown';
        } else {
          console.log(err);
        }
        return res.status(500).json({
          error: 500,
          message: 'Internal server error',
          reqId,
        });
      }
      next();
    });
  };
};
