import joi from "joi";
import { DocumentCollection, EdgeCollection } from "arangojs";
import { Request, Response, NextFunction } from "express";

declare global {
  type ControllerAction = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

  interface ControllerModule {
    [key: string]: ControllerAction;
  }

  namespace Repo {
    type DateTimestamp = string;
    type CollectionType = "edge" | "document";
    type Collection = EdgeCollection | DocumentCollection;

    type IndexType = "ttl" | "geo" | "hash" | "skiplist" | "fulltext" | "persistent";

    type IndexDefinition = {
      type: IndexType;
      fields: string[];
      unique?: boolean;
    };

    interface CollectionMeta {
      id: string;
      name: string;
      status: number;
      type: number;
      isSystem: boolean;
      globallyUniqueId: string;
    }

    interface CollectionExport {
      name: string;
      index?: IndexDefinition;
      schema: joi.ObjectSchema;
      collection: DocumentCollection;
    }

    interface CollectionDefinition extends CollectionExport {
      type: CollectionType;
    }

    interface EdgeExport {
      name: string;
      collection: EdgeCollection;
    }

    interface EdgeDefinition extends EdgeExport {
      type: CollectionType;
    }
  }

  namespace Arango {
    namespace Foxx {
      type ConfigurationType = "json" | "string" | "number" | "boolean" | "integer" | "password";

      interface Configuration {
        default?: string;
        description?: string;
        type: ConfigurationType;
      }

      interface Manifest {
        name: string;
        main: string;
        author: string;
        version: string;
        $schema: string;
        tests: string[];
        engines: object;
        scripts: object;
        description: string;
        dependencies: object;
        configuration: { [key: string]: Configuration };
      }

      interface Metadata {
        name: string;
        path: string;
        mount: string;
        version: string;
        legacy: boolean;
        options: object;
        checksum: string;
        manifest: Manifest;
        development: boolean;
      }
    }

    interface InsertResults {
      _id: string;
      _key: string;
      _rev: string;
    }
  }
}
