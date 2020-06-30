/**
 * This s a script file that can be called by running `npm run teardown:repo`
 *
 * *NOTE: This file is not meant to be imported elsewhere in the project!*
 *
 * ### Examples
 * ```sh
 * npm run teardown:repo
 * ```
 *
 * @packageDocumentation
 * @category Executable
 */

import DB from "./database";

(async function teardown() {
  const collections: Repo.CollectionMeta[] = await DB.listCollections(true);

  Promise.all(
    collections.map(
      (collection: Repo.CollectionMeta): Promise<void> => {
        console.info("Truncating...", collection.name);
        const dbCollection: Repo.Collection = DB.collection(collection.name);

        return dbCollection.truncate();
      },
    ),
  );

  DB.collection("_jobs").truncate();
})();
