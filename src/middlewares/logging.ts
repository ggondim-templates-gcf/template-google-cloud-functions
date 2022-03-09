import { Application, Request, Response } from 'express';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import morgan from 'morgan';
import { v6 as uuid } from 'uuid-with-v6';

export default (app: Application) => {
  const { NODE_ENV } = process.env;

  Bugsnag.start({
    apiKey: 'YOUR_API_KEY',
    plugins: [BugsnagPluginExpress],
  });
  const bugsnag = Bugsnag.getPlugin('express');

  if (NODE_ENV === 'production') {
    app.use(bugsnag.requestHandler);
    app.use(req => {
      const reqId = uuid();
      req.bugsnag?.addMetadata('request', { id: reqId });
    });
  } else if (NODE_ENV === 'development' || NODE_ENV === 'local') {
    app.use(morgan);
  }

  return () => {
    // post middleware cascade
    if (NODE_ENV === 'production') {
      app.use(bugsnag.errorHandler);
      app.use((err, req: Request, res: Response) => {
        if (err) {
          const reqId = req.bugsnag
            ? req.bugsnag.getMetadata('request', 'id') as string
            : 'unknown';
          res.status(500).json({
            error: 500,
            message: 'Internal server error',
            reqId,
          });
        }
      });
    }
  };
};
