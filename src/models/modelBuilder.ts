import { DocumentCollection, EdgeCollection } from 'arangojs';
import { Document, DocumentData } from 'arangojs/lib/cjs/util/types';

/* Exports */
export default modelBuilder;

/* Module Functions */
function modelBuilder<T extends object = any>(
  Collection: DocumentCollection<T> | EdgeCollection<T>,
) {
  return {
    get,
    find,
    findOne,
    create,
    edit,
    remove,
  };

  function get(id: string): Promise<Document<T>> {
    return Collection.document({ _key: id });
  }

  async function find(searchObject: object): Promise<Document<T>[]> {
    const cursor = await Collection.byExample(searchObject);
    return cursor.all();
  }

  async function findOne(searchObject: object): Promise<Document<T>> {
    try {
      const doc = await Collection.firstExample(searchObject);
      return doc;
    } catch (error) {
      return null;
    }
  }

  async function create(body: DocumentData<T>): Promise<Document<T>> {
    const meta: Arango.InsertResults = await Collection.save(body);

    return { ...meta, ...body };
  }

  async function edit(
    id: string,
    body: DocumentData<Partial<T>>,
  ): Promise<Document<T>> {
    const meta: Arango.InsertResults = await Collection.update(
      { _key: id },
      body,
    );

    return { ...meta, ...body };
  }

  async function remove(id: string): Promise<void> {
    Collection.remove({ _key: id });
  }
}
