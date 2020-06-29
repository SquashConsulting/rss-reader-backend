import { Router } from 'express';

import joi from 'joi';
import validateRequest from 'express-joi-validator';

import Feed from 'repository/collections/feed';
import FeedController from 'controllers/feed';

const feedRouter: Router = Router();

const paramSchema = {
  id: joi.string().required(),
};

const querySchema = {
  limit: joi.number().optional().default(10),
  offset: joi.number().optional().default(0),
};

feedRouter.get(
  '/:id',
  validateRequest({
    query: querySchema,
    params: paramSchema,
  }),
  FeedController.Get,
);

feedRouter.post(
  '/',
  validateRequest({
    body: {
      feed: Feed.schema,
    },
  }),
  FeedController.Create,
);

feedRouter.put(
  '/:id/parse',
  validateRequest({
    params: paramSchema,
  }),
  FeedController.UpdateItems,
);

export default feedRouter;
