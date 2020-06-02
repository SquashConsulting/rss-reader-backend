import joi from 'joi';

import DB from 'repository/database';
import { DocumentCollection } from 'arangojs';

/* Constants */
const name = 'items';
const collection: DocumentCollection<Repo.Item> = DB.collection(name);
const index: Repo.IndexDefinition = { type: 'hash', fields: ['guid'] };
const schema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
  })
  .required();

/* Exports */
const defaultExport: Repo.CollectionExport = {
  name,
  index,
  schema,
  collection,
};

export default defaultExport;
