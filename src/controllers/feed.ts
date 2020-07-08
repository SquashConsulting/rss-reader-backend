/**
 * Feed Controller
 *
 * @packageDocumentation
 * @category Controller
 */
import { Request, Response } from "express";
import { Document } from "arangojs/lib/cjs/util/types";

import Feed from "models/feed";

import Daemon from "services/daemon";
import FeedService from "services/feed";

import Serializer from "serializers";

import ControllerDecorator from "decorators/controller";

export default ControllerDecorator({ All, Get, Create, UpdateItems });

/**
 * Given a Request defined by {@link "routes/feed".FeedRouter | FeedRouter},
 * gets metadata about all `Feeds`.
 *
 * @response {@linkcode "serializers/feed".SerializerOptions | FeedSerializer}
 */
async function All(_req: Request, res: Response): Promise<void> {
  const feeds: Document<Repo.Feed>[] = await Feed.all();

  res.status(200).json(Serializer.serialize("feeds", feeds, "meta-only"));
}

/**
 * Given a Request defined by {@link "routes/feed".FeedRouter | FeedRouter},
 * gets the Feed with its relationships.
 *
 * @response {@linkcode "serializers/feed".SerializerOptions | FeedSerializer}
 */
async function Get(req: Request, res: Response): Promise<void> {
  const feedId = req.params.id;
  const limit = parseInt(req.query.limit as string, 10);
  const lastItemId = parseInt(req.query.lastItemId as string, 10);

  const feedView: Document<Repo.Feed> = await Feed.view(feedId, limit, lastItemId);

  res.status(200).json(
    Serializer.serialize("feeds", feedView, {
      limit,
      count: feedView.items.length,
    }),
  );
}

/**
 * Given a Request defined by {@link "routes/feed".FeedRouter | FeedRouter},
 * creates a Feed, fetches and saves RSS Feed Items, and creates a Daemon job
 * to repeatedly fetch the Feed.
 *
 * @response {@linkcode "serializers/feed".SerializerOptions | FeedSerializer}
 */
async function Create(req: Request, res: Response): Promise<void> {
  const feed: Repo.FeedParams = req.body.feed;
  const savedFeed = await FeedService.createFeed(feed);

  res.status(200).send(Serializer.serialize("feeds", savedFeed));

  Daemon.createJob(savedFeed);
}

/**
 * Given a Request defined by {@link "routes/feed".FeedRouter | FeedRouter},
 * Finds newly updated RSS Feed Items and updates them in the database.
 *
 * @response {@linkcode "serializers/feed".SerializerOptions | FeedSerializer}
 */
async function UpdateItems(req: Request, res: Response): Promise<void> {
  const feedId = req.params.id;

  const newItems: Repo.Item[] = await FeedService.updateItems(feedId);

  if (!newItems) {
    res.status(204).end();
    return;
  }

  res.status(200).json(Serializer.serialize("items", newItems));
}
