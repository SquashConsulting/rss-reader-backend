import { Router } from 'express';

import joi from 'joi';
import validateRequest from 'express-joi-validator';

import Feed from 'repository/collections/feed';
import FeedController from 'controllers/feed';

const feedRouter: Router = Router();

feedRouter.get(
  '/:id',
  validateRequest({
    params: {
      id: joi.number().integer().required(),
    },
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

export default feedRouter;
