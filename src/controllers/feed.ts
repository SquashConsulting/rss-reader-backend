import omit from 'lodash.omit';
import { Request, Response, query } from 'express';
import { Document } from 'arangojs/lib/cjs/util/types';

import Feed from 'models/feed';
import Item from 'models/item';

import Parser from 'services/parser';
import Daemon from 'services/daemon';

import Serializer from 'serializers';

import ControllerDecorator from 'decorators/controller';

/* Exports */
export default ControllerDecorator({ Get, Create, UpdateItems });

/* Module Functions */
async function Get(req: Request, res: Response): Promise<void> {
  const feedId = req.params.id;
  const limit = parseInt(req.query.limit as string, 10);
  const offset = parseInt(req.query.offset as string, 10);

  const feedView: Document<Repo.Feed> = await Feed.view(feedId, limit, offset);

  res.status(200).json(
    Serializer.serialize('feeds', feedView, {
      limit,
      offset,
      count: feedView.items.length,
    }),
  );
}

async function Create(req: Request, res: Response): Promise<void> {
  const feed: Repo.Feed = req.body.feed;

  {
    const feedExists = await Feed.findOne({ link: feed.link });
    if (feedExists) {
      res.status(409).json({ error: 'Feed already exists' });
      return;
    }
  }

  const parsedFeed = await Parser.parseURL(feed.link);

  const items: Repo.Item[] = parsedFeed.items as Repo.Item[];
  const feedBody: Repo.Feed = omit(parsedFeed, 'items') as Repo.Feed;
  const lastItemGuid = items[0].guid;

  const savedFeed: Document<Repo.Feed> = await Feed.create({
    ...feedBody,
    lastItemGuid,
    link: feed.link,
  });

  await Item.create(items, savedFeed._id);

  res.status(200).send(Serializer.serialize('feeds', savedFeed));

  Daemon.createJob(savedFeed);
}

async function UpdateItems(req: Request, res: Response): Promise<void> {
  const feedId = req.params.id;
  const feed: Document<Repo.Feed> = await Feed.get(feedId);

  const newItems: Repo.Item[] = await Parser.getNewItems(feed);

  if (!newItems) {
    res.status(204).end();
    return;
  }

  res.status(200).json(Serializer.serialize('items', newItems));

  Promise.all([
    Feed.edit(feed._key, {
      lastItemGuid: newItems[0].guid,
    }),
    Item.create(newItems, feed._id),
  ]);
}
