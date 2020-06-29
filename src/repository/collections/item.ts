/**
 * Feed Item Collection Definition
 *
 * @packageDocumentation
 * @category Collection
 */
import joi from 'joi';

import DB from 'repository/database';
import { DocumentCollection } from 'arangojs';

const name = 'items';
const collection: DocumentCollection<Repo.Item> = DB.collection(name);
const index: Repo.IndexDefinition = { type: 'hash', fields: ['guid'] };
const schema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
  })
  .required();

export default {
  name,
  index,
  schema,
  collection,
} as Repo.CollectionExport;
