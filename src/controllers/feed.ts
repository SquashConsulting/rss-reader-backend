import omit from 'lodash.omit';
import { Document } from 'arangojs/lib/cjs/util/types';
import { Request, Response, NextFunction } from 'express';

import Feed from 'models/feed';
import Item from 'models/item';
import Parser from 'services/parser';
import Daemon from 'services/daemon';
import ControllerDecorator from 'decorators/controller';

/* Exports */
export default ControllerDecorator({ Get, Create });

/* Module Functions */
async function Get(req: Request, res: Response): Promise<void> {
  const feed: Document<Repo.Feed> = await Feed.get(req.params.id);
  const feedView: Document<Repo.Feed> = await Feed.view(feed);

  res.status(200).send({ feed: feedView });
}

async function Create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
  const lastItemGuid = items[0]?.guid;

  const savedFeed: Document<Repo.Feed> = await Feed.create({
    ...feedBody,
    lastItemGuid,
    link: feed.link,
  });

  await Item.create(items, savedFeed._id);

  res.status(200).send({ items, feed: savedFeed });

  Daemon.createJob(savedFeed);
}
