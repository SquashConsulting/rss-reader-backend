import { Options } from 'json-api-serializer';
import { Document } from 'arangojs/lib/cjs/util/types';

type ExtraData = { [key: string]: any };

const SerializerOptions: Options = {
  id: '_key',
  blacklist: ['_id', '_rev'],
  topLevelMeta: {
    hasMore: (extraData: ExtraData) => extraData.count === extraData.limit,
  },
  topLevelLinks: {
    next: (data: Document<Repo.Feed>, extraData: ExtraData) =>
      `/feeds/${data._key}?limit=${extraData.limit}&offset=${extraData.count}`,
  },
  relationships: {
    items: {
      type: 'items',
    },
  },
};

export default SerializerOptions;
