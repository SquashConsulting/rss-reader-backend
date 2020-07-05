/**
 * Category Collection Definition
 *
 * @packageDocumentation
 * @category Collection
 */
import joi from "joi";

import DB from "repository/database";
import { DocumentCollection } from "arangojs";

const name = "feeds";
const collection: DocumentCollection<Repo.Feed> = DB.collection(name);

const index: Repo.IndexDefinition = {
  type: "hash",
  unique: true,
  fields: ["feedUrl"],
};

/**
 * - `link` - `String` [required]
 * - `title` - `String` [optional]
 */
const schema = joi
  .object({
    link: joi.string().required(),
    title: joi.string().optional(),
  })
  .required();

export default {
  name,
  index,
  schema,
  collection,
} as Repo.CollectionExport;
