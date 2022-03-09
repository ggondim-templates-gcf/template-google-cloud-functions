import { Request, Response, Application } from 'express';
import asyncHandler from 'express-async-handler';

const GET_OPERATION_ROUTE = '/route';

export const GET_OPERATION_OAS = {
  paths: {
    [GET_OPERATION_ROUTE]: {
      get: {
        summary: 'Returns the request header.',
        responses: {
          200: {
            content: {
              'text/plain; charset=utf-8': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

// eslint-disable-next-line @typescript-eslint/require-await
async function getOperation(
  req: Request,
  res: Response,
) {
  res.send(req.headers.accept);
}

export default (app: Application) => {
  app.get(GET_OPERATION_ROUTE, asyncHandler(getOperation));
};

export const specs = {
  ...GET_OPERATION_OAS,
};
