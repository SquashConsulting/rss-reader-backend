/**
 * The Parser service is responsible for RSS Feed parsing.
 *
 * @packageDocumentation
 * @category Service
 */
import Parser from "rss-parser";
import { Document } from "arangojs/lib/cjs/util/types";

import * as Errors from "utils/errors";

import type { IError } from "utils/errors";

const PARSER = new Parser();

export default { parseURL, getNewItems };

/**
 * Given a {@link "repository/collections/feed" | Feed},
 * tries to fetch new RSS Feed Items, check the latest saved item,
 * and return the newly updated items.
 *
 * **Example:**
 * ```typescript
 * const feed: Document<Repo.Feed> = await Feed.get(feedId);
 * const newItems: Repo.Item[] = await Parser.getNewItems(feed);
 *
 * Item.create(newItems, feed._id);
 * ```
 */
async function getNewItems(feed: Document<Repo.Feed>): Promise<Repo.Item[]> {
  const parsedFeed = await parseURL(feed.feedUrl);
  const items: Repo.Item[] = getStandardizedItems(
    parsedFeed.items,
  ) as Repo.Item[];

  const currentLastItemGuid = items[0].guid;
  if (feed.lastItemGuid === currentLastItemGuid) return null;

  const lastItemIndex: number = items.findIndex(
    (item: Repo.Item): boolean => item.guid === feed.lastItemGuid,
  );

  const newItems: Repo.Item[] = items.slice(0, lastItemIndex);
  return newItems;
}

/**
 * Given a url to an RSS Feed,
 * parses the feed and returns in a standardized form.
 *
 * **Example:**
 * ```typescript
 * const feed = req.body.feed;
 * const parsedFeed: Parser.Output = await Parser.parseURL(feed.link);
 * ```
 */
async function parseURL(url: string): Promise<Parser.Output> {
  try {
    const feed = await PARSER.parseURL(url);
    const items = getStandardizedItems(feed.items);

    return { ...feed, items };
  } catch (error) {
    throw buildError(error);
  }
}

/**
 * @internal
 */
function buildError(error: Error): IError {
  // Standardizing possible error messages
  // Error messages taken from: https://github.com/rbren/rss-parser/blob/master/lib/parser.js
  if (error.message.startsWith("Status code")) {
    const [, statusCode] = error.message.split("Status code ");
    const statusAsNumber = parseInt(statusCode, 10);
    return new Errors.BaseError(error.message, statusAsNumber);
  }

  if (error.message.startsWith("Request timed out")) {
    return new Errors.TimeoutError(error.message);
  }

  return new Errors.BadRequestError(error.message);
}

/**
 * @internal
 */
function getStandardizedItems(items: Parser.Item[]): Parser.Item[] {
  const item = items[0];

  if (item.guid) return items;

  const itemsWithGuid = items.map((item: Parser.Item) => ({
    ...item,
    id: undefined,
    guid: item.id,
  }));

  return itemsWithGuid;
}
