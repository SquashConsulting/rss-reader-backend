/**
 * Middleware Definitions
 *
 * @packageDocumentation
 * @category Middleware
 */
import * as Express from 'express';

import morgan from 'morgan';
import bodyParser from 'body-parser';

export { initMiddlewares, handleRouterErrors };

/**
 * Given an Express App, this function sets up the initial middlewares
 */
function initMiddlewares(server: Express.Express): Express.Express {
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(morgan('combined'));

  return server;
}

/**
 * Given an Express App, this function sets up Router Error Handler Middleware.
 */
function handleRouterErrors(server: Express.Express): Express.Express {
  server.use(
    (
      err: any,
      _req: Express.Request,
      res: Express.Response,
      _next: Express.NextFunction,
    ) => {
      if (err.isBoom) return res.status(err.output.statusCode).json(err);

      if (err.statusCode)
        return res.status(err.statusCode).json({ error: err.message });

      return res.status(500).json({ error: err.message });
    },
  );

  return server;
}
