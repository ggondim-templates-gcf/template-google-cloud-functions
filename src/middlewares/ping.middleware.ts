import { Request, Response, Application } from 'express';
import asyncHandler from 'express-async-handler';

// eslint-disable-next-line @typescript-eslint/require-await
async function pingMiddleware(
  req: Request,
  res: Response,
) {
  if (req.headers['x-ping']) {
    res.setHeader('X-Pong', 'pong');
    res.status(204);
    res.send('');
  }
}

export default (app: Application) => app.use(asyncHandler(pingMiddleware));
