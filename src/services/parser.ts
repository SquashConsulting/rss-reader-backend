/**
 * The Parser service is responsible for RSS Feed parsing.
 */

import Parser from 'rss-parser';
import { Document } from 'arangojs/lib/cjs/util/types';

/* Constants */
const PARSER = new Parser();

/* Exports */
export default { parseURL, getNewItems };

/* Module Functions */
async function getNewItems(
  feed: Document<Repo.Feed>,
): Promise<Repo.Item[] | null> {
  const parsedFeed = await parseURL(feed.link);
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

async function parseURL(url: string): Promise<Parser.Output> {
  try {
    const feed = await PARSER.parseURL(url);
    const items = getStandardizedItems(feed.items);

    return { ...feed, items };
  } catch (error) {
    throw buildError(error);
  }
}

/* Private Functions */
function buildError(error: Error): Error & { statusCode?: number } {
  // Standardizing possible error messages
  // Error messages taken from: https://github.com/rbren/rss-parser/blob/master/lib/parser.js
  let newError: Error & { statusCode?: number } = new Error(error.message);

  if (error.message.startsWith('Status code')) {
    const [, statusCode] = error.message.split('Status code ');
    newError.statusCode = parseInt(statusCode, 10);
  } else if (error.message.startsWith('Request timed out')) {
    newError.statusCode = 408;
  } else {
    newError.statusCode = 400;
  }

  return newError;
}

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
