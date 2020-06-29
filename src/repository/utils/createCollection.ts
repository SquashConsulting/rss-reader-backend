/**
 * Collection Creator
 *
 * @packageDocumentation
 * @category Utility
 */
import { Database, DocumentCollection, EdgeCollection } from 'arangojs';

export default createCollection;

/**
 * Creates an ArangoDB Edge Collection if it doesn't exist
 */
async function createCollection(
  DB: Database,
  name: string,
  type: 'edge',
  isSystem?: boolean,
): Promise<EdgeCollection>;

/**
 * Creates an ArangoDB Document Collection if it doesn't exist
 */
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
