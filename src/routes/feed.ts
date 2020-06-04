import { Router } from 'express';

import joi from 'joi';
import validateRequest from 'express-joi-validator';

import Feed from 'repository/collections/feed';
import FeedController from 'controllers/feed';

const feedRouter: Router = Router();

const paramSchema = {
  id: joi.number().integer().required(),
};

feedRouter.get(
  '/:id',
  validateRequest({
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
