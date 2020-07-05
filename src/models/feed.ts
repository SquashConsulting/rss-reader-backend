/**
 * Feed Model Definition
 *
 * This Model exports the {@link "models/modelBuilder" | default} operations
 * extending it with {@linkcode view} operation.
 *
 * @packageDocumentation
 * @category Model
 */
import { aql } from "arangojs";

import { ArrayCursor } from "arangojs/lib/cjs/cursor";
import { Document } from "arangojs/lib/cjs/util/types";
import { GeneratedAqlQuery } from "arangojs/lib/cjs/aql-query";

import modelBuilder from "./modelBuilder";
import Feed from "repository/collections/feed";
import HasItems from "repository/edges/hasItems";

const defaultOperations = modelBuilder<Repo.Feed>(Feed.collection);
export default { ...defaultOperations, view };

/**
 * Given a Feed's id and optional query parameters,
 * returns a Feed with its relationships.
 *
 * **Example:**
 * ```typescript
 * const feedView = await Feed.view(feedId, 10, 5);
 * res.json(Serializer.serialize('feeds', feedView));
 * ```
 */
async function view(
  id: string,
  limit: number = 10,
  lastItemId: number = 0,
): Promise<Document<Repo.Feed>> {
  const lastItemFilter = aql`
    FILTER TO_NUMBER(item._key) > ${lastItemId}
  `;

  const viewQuery: GeneratedAqlQuery = aql`
    LET feed = DOCUMENT(${Feed.collection}, ${id})
    LET items = (
      FOR item, has_items IN OUTBOUND feed ${HasItems.collection}
        ${lastItemFilter}
        LIMIT ${limit}
        RETURN item
      )

    RETURN MERGE(feed, { items })
  `;

  const cursor: ArrayCursor = await defaultOperations.executeAQL(viewQuery);
  const feed: Document<Repo.Feed> = await cursor.next();

  return feed;
}
