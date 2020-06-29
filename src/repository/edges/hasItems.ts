/**
 * @packageDocumentation
 * @internal
 */
import DB from 'repository/database';
import { EdgeCollection } from 'arangojs';

/* Constants */
const name = 'has_items';
const collection: EdgeCollection<Repo.HasItems> = DB.edgeCollection(name);

/* Exports */
const defaultExport: Repo.EdgeExport = { name, collection };
export default defaultExport;
