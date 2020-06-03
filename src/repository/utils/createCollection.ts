import { Database, DocumentCollection, EdgeCollection } from 'arangojs';

/* Type Definitions */
/* Module Exports */
export default createCollection;

/* Module Functions */
async function createCollection(
  DB: Database,
  name: string,
  type: 'edge',
  isSystem?: boolean,
): Promise<EdgeCollection>;
async function createCollection(
  DB: Database,
  name: string,
  type: 'document',
  isSystem?: boolean,
): Promise<DocumentCollection>;
async function createCollection(
  DB: Database,
  name: string,
  type: Repo.CollectionType,
  isSystem: boolean = false,
): Promise<Repo.Collection> {
  const collection =
    type === 'edge' ? DB.edgeCollection(name) : DB.collection(name);

  const collectionExists = await collection.exists();
  if (collectionExists) return collection;

  await collection.create({ isSystem });

  return collection;
}
