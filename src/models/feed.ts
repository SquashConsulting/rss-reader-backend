import { Document, Edge } from 'arangojs/lib/cjs/util/types';

import modelBuilder from './modelBuilder';
import Feed from 'repository/collections/feed';
import Item from 'repository/collections/item';
import HasItems from 'repository/edges/hasItems';

/* Exports */
const defaultOperations = modelBuilder<Repo.Feed>(Feed.collection);
export default { ...defaultOperations, view };

/* Module Functions */
async function view(feed: Document<Repo.Feed>): Promise<Document<Repo.Feed>> {
  const hasItems: Edge<Repo.HasItems> = await HasItems.collection.outEdges(
    feed,
  );

  const items: Document<Repo.Item>[] = await Promise.all(
    hasItems.map(
      (edge: Edge<Repo.HasItems>): Promise<Document> =>
        Item.collection.document({ _id: edge._to }),
    ),
  );

  return { ...feed, items };
}
