import { aql } from 'arangojs';

import { Document, Edge } from 'arangojs/lib/cjs/util/types';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';

import modelBuilder from './modelBuilder';
import Feed from 'repository/collections/feed';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';

/* Exports */
const defaultOperations = modelBuilder<Repo.Feed>(Feed.collection);
export default { ...defaultOperations, view };

/* Module Functions */
async function view(
  id: string,
  limit: number = 10,
  offset: number = 0,
): Promise<Document<Repo.Feed>> {
  const viewQuery: GeneratedAqlQuery = aql`
    LET feed = DOCUMENT(${Feed.collection.name}, ${id})
    LET items = (
      FOR item, has_items IN OUTBOUND feed has_items
        LIMIT ${offset}, ${limit}
        SORT has_items.createdAt DESC
        RETURN item
      )

    RETURN MERGE(feed, { items })
  `;

  const cursor: ArrayCursor = await defaultOperations.executeAQL(viewQuery);
  const feed: Document<Repo.Feed> = await cursor.next();

  return feed;
}
