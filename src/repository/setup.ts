/**
 * Set's up ArangoDB Repository with given collections.
 *
 * *NOTE: This file is not meant to be imported elsewhere in the project!*
 *
 * ### Examples:
 * ```sh
 * npm run setup:repo
 * ```
 *
 * @packageDocumentation
 * @category Executable
 */
import { EdgeCollection, DocumentCollection } from "arangojs";

import DB from "./database";

import Edges from "repository/edges";
import Collections from "repository/collections";

import createCollection from "./utils/createCollection";

// Create Document Collections
Promise.all(
  Collections.map(
    async (
      collection: Repo.CollectionDefinition,
    ): Promise<DocumentCollection> => {
      console.info(`Creating collection ${collection.name}`);

      const documentCollection: DocumentCollection = await createCollection(
        DB,
        collection.name,
        "document",
      );

      if (!collection.index) return documentCollection;
      return documentCollection.ensureIndex(collection.index);
    },
  ),
);

// Create Edge Collections
Promise.all(
  Edges.map(
    async (edge: Repo.EdgeDefinition): Promise<void> => {
      console.info(`Creating edge collection ${edge.name}`);

      const edgeCollection: EdgeCollection = await createCollection(
        DB,
        edge.name,
        "edge",
      );

      edgeCollection.ensureIndex({
        type: "hash",
        fields: ["_from", "_to"],
      });
    },
  ),
);
