/**
 * Serializer Definitions
 *
 * This module defines the following Serializers:
 * - `feeds` - {@link "serializers/feed".SerializerOptions | FeedSerializer}
 * - `items` - {@link "serializers/item".SerializerOptions | ItemsSerializer}
 *
 * @packageDocumentation
 * @category Serializer
 */
import JSONAPISerializer from "json-api-serializer";

import FeedSerializer, { MetadataSerializerOptions } from "./feed";
import ItemSerializer from "./item";

const Serializer = new JSONAPISerializer();

Serializer.register("feeds", FeedSerializer);
Serializer.register("feeds", "meta-only", MetadataSerializerOptions);

Serializer.register("items", ItemSerializer);

export default Serializer;
