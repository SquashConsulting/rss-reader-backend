import JSONAPISerializer from 'json-api-serializer';

import FeedSerializer from './feed';
import ItemSerializer from './item';

const Serializer = new JSONAPISerializer();

Serializer.register('feeds', FeedSerializer);
Serializer.register('items', ItemSerializer);

export default Serializer;
