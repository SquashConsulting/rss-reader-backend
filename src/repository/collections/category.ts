/**
 * Category Collection Definition
 *
 * @packageDocumentation
 * @category Collection
 */
import joi from "joi";

import DB from "repository/database";
import { DocumentCollection } from "arangojs";

const name = "categories";
const collection: DocumentCollection<Repo.Category> = DB.collection(name);

/**
 * - `title` - `String` [required]
 */
const schema = joi
  .object({
    title: joi.string().required(),
  })
  .required();

export default { name, schema, collection } as Repo.CollectionExport;
