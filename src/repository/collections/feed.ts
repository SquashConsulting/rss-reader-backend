import joi from 'joi';

import DB from 'repository/database';
import { DocumentCollection } from 'arangojs';

/* Constants */
const name = 'feeds';
const collection: DocumentCollection<Repo.Feed> = DB.collection(name);

const index: Repo.IndexDefinition = {
  type: 'hash',
  unique: true,
  fields: ['link'],
};

const schema = joi
  .object({
    link: joi.string().required(),
    title: joi.string().optional(),
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
