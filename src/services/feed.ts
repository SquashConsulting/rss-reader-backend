/**
 * Feed Service
 *
 * @packageDocumentation
 * @category Service
 */
import omit from "lodash.omit";
import { Document } from "arangojs/lib/cjs/util/types";

import Feed from "models/feed";
import Item from "models/item";

import Parser from "services/parser";

import { ConflictError } from "utils/errors";

export default {
  createFeed,
  updateItems,
};

/**
 * Given a Feed URL and (optionally) a title, parses the RSS Feed
 * and inserts in the database.
 *
 * **Example:**
 * ```typescript
 * const feed: Document<Repo.Feed> = await FeedService.createFeed(req.body.feed);
 * Daemon.createJob(feed);
 * ```
 */
async function createFeed(feed: { title?: string; link: string }): Promise<Document<Repo.Feed>> {
  const parsedFeed = await Parser.parseURL(feed.link);
  const feedUrl = parsedFeed.feedUrl || feed.link;

  {
    const feedExists = await Feed.findOne({ feedUrl });
    if (feedExists) {
      throw new ConflictError("Feed already exists");
    }
  }

  const items: Repo.Item[] = parsedFeed.items as Repo.Item[];

  const _feedBody: Repo.Feed = omit(parsedFeed, "items") as Repo.Feed;
  const feedBody: Repo.Feed = feed.title ? { ..._feedBody, title: feed.title } : _feedBody;

  const lastItemGuid = items[0].guid;

  const savedFeed: Document<Repo.Feed> = await Feed.create({
    ...feedBody,
    feedUrl,
    lastItemGuid,
  });

  Item.create(items, savedFeed._id);
  return savedFeed;
}

/**
 * Given a Feed ID, parses the feed and updates latest RSS Items.
 *
 * **Example:**
 * ```typescript
 * const newItems: Repo.Item[] = await FeedService.updateItems(req.params.id);
 * console.log(`You have ${newItems.length} new item(s)`);
 * ```
 */
async function updateItems(feedId: string): Promise<Repo.Item[]> {
  const feed: Document<Repo.Feed> = await Feed.get(feedId);

  const newItems: Repo.Item[] = await Parser.getNewItems(feed);

  if (!newItems) return null;

  Promise.all([
    Feed.edit(feed._key, {
      lastItemGuid: newItems[0].guid,
    }),
    Item.create(newItems, feed._id),
  ]);

  return newItems;
}
