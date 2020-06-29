/**
 * @packageDocumentation
 * @internal
 */
import { DocumentCollection } from 'arangojs';

import DB from 'repository/database';

import createCollection from './createCollection';

export default async function createMigrations() {
  console.info('Creating migrations collection');

  const migrationCollection: DocumentCollection = await createCollection(
    DB,
    '_migrations',
    'document',
    true,
  );

  await migrationCollection.ensureIndex({
    type: 'hash',
    fields: ['latestTimestamp'],
  });

  migrationCollection.save({ _key: 'MASTER', latestTimestamp: null });
}
