/**
 * `/feeds` Router Initilzer
 *
 * @packageDocumentation
 * @category Router
 */
import { Router } from "express";

import joi from "joi";
import validateRequest from "express-joi-validator";

import Feed from "repository/collections/feed";
import FeedController from "controllers/feed";

/**
 * FeedRouter defines the following routes:
 *
 * * GET `/:id` - Returns {@link "serializers/feed".SerializerOptions | Feed Serializer}
 *   * Params - {@link paramSchema | Param Schema}
 *   * Query - {@link querySchema | Query Schema}
 *
 * * POST `/` - Adds a new RSS Feed
 *   * Body: {@link "repository/collections/feed".schema | Feed Schema}
 *
 * * PUT `/:id/parse` - Fetches Latest RSS Changes and Updates New Items
 *   * Params - {@link paramSchema | Param Schema}
 */
const FeedRouter: Router = Router();

const paramSchema = {
  id: joi.string().required(),
};

const querySchema = {
  limit: joi.number().optional().default(10),
  offset: joi.number().optional().default(0),
};

FeedRouter.get(
  "/:id",
  validateRequest({
    query: querySchema,
    params: paramSchema,
  }),
  FeedController.Get,
);

FeedRouter.post(
  "/",
  validateRequest({
    body: {
      feed: Feed.schema,
    },
  }),
  FeedController.Create,
);

FeedRouter.put(
  "/:id/parse",
  validateRequest({
    params: paramSchema,
  }),
  FeedController.UpdateItems,
);

export default FeedRouter;
