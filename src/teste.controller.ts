import {
  Request, Response, Application,
} from 'express';
import asyncHandler from 'express-async-handler';

// eslint-disable-next-line @typescript-eslint/require-await
async function controller(
  req: Request,
  res: Response,
) {
  res.send(req.headers.accept);
}

export default (app: Application) => app.get('/rota', asyncHandler(controller));
