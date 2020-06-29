/**
 * API Router Initilzer
 *
 * Available Routes:
 * - `/feeds` {@link FeedRouter}
 * - `/categories` {@link CategoryRouter}
 *
 * @packageDocumentation
 * @category Router
 */

import { Express } from 'express';

import FeedRouter from './feed';
import CategoryRouter from './category';

export default setupRoutes;

/**
 * Initiates API Routes
 */
function setupRoutes(server: Express): Express {
  server.use('/feeds', FeedRouter);
  server.use('/categories', CategoryRouter);

  return server;
}
