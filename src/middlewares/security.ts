import { Request, Response, Application } from 'express';
import cors from 'cors';

export function securityMiddleware(
  req: Request,
  res: Response,
) {
  if (req.headers['x-ping']) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // https://github.com/helmetjs/helmet/issues/230
    res.setHeader('X-XSS-Protection', '0');

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#mime_sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // eslint-disable-next-line max-len
    // https://docs.microsoft.com/en-us/archive/blogs/ie/ie8-security-part-v-comprehensive-protection
    res.setHeader('X-Download-Options', 'noopen');
  }
}

export default (app: Application) => {
  app.use(securityMiddleware);

  // https://github.com/expressjs/express/pull/2813#issuecomment-159270428
  app.disable('x-powered-by');

  app.use(cors());
};
