import { Options } from 'json-api-serializer';

const SerializerOptions: Options = {
  id: '_key',
  blacklist: ['_id', '_rev'],
  relationships: {
    items: {
      type: 'items',
    },
  },
};

export default SerializerOptions;
