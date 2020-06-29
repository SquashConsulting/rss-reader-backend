/**
 * @packageDocumentation
 * @category Serializer
 */
import { Options } from 'json-api-serializer';
import { Document } from 'arangojs/lib/cjs/util/types';

const SerializerOptions: Options = {
  id: '_key',
  blacklist: ['_id', '_rev', 'link'],
  links: {
    external: (data: Document<Repo.Item>): string => data.link,
  },
};

export default SerializerOptions;
