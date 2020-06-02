import modelBuilder from './modelBuilder';
import Item from 'repository/collections/item';
import HasItems from 'repository/edges/hasItems';
import { DocumentHandle } from 'arangojs/lib/cjs/collection';
import { Document } from 'arangojs/lib/cjs/util/types';

/* Exports */
const defaultOperations = modelBuilder<Repo.Item>(Item.collection);
export default { ...defaultOperations, create };

/* Module Functions */
async function create(
  items: Repo.Item | Repo.Item[],
  feedId: string,
): Promise<void> {
  if (!Array.isArray(items)) items = [items];

  const itemMetas: Arango.InsertResults[] = await Promise.all(
    items.map(
      (item: Repo.Item): Promise<Arango.InsertResults> =>
        Item.collection.save(item),
    ),
  );

  Promise.all(
    itemMetas.map(
      (itemMeta: Arango.InsertResults): Promise<Arango.InsertResults> =>
        HasItems.collection.save({
          _from: feedId,
          _to: itemMeta._id,
          createdAt: Date.now().toString(),
        }),
    ),
  );
}
