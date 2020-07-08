/**
 * Feed Item Model Definition
 *
 * This Model exports the {@link "models/modelBuilder" | default} operations
 * overriding the {@link create} action
 *
 * @packageDocumentation
 * @category Model
 */
import modelBuilder from "./modelBuilder";
import Item from "repository/collections/item";
import HasItems from "repository/edges/hasItems";

const defaultOperations = modelBuilder<Repo.Item>(Item.collection);
export default { ...defaultOperations, create };

/**
 * Given an array of Feed Items,
 * saves them in the database and creates a `HasItems`
 * relationship between Feed and Items.
 *
 * **Example:**
 * ```typescript
 * Items.create(items, feedId);
 * ```
 */
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
