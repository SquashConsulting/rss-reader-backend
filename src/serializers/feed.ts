/**
 * @packageDocumentation
 * @category Serializer
 */
import omit from "lodash.omit";
import { Options } from "json-api-serializer";
import { Document } from "arangojs/lib/cjs/util/types";

type ExtraData = { [key: string]: any };

function lastItemId(data: Document<Repo.Feed>): string {
  const lastItemKey = data.items[data.items.length - 1]?._key;
  return lastItemKey ? `&lastItemId=${lastItemKey}` : "";
}

const SerializerOptions: Options = {
  id: "_key",
  blacklist: ["_id", "_rev"],
  topLevelMeta: {
    hasMore: (extraData: ExtraData) => extraData.count === extraData.limit,
  },
  topLevelLinks: {
    next: (data: Document<Repo.Feed>, extraData: ExtraData) =>
      extraData &&
      `/feeds/${data._key}?limit=${extraData.limit}${lastItemId(data)}`,
  },
  relationships: {
    items: {
      type: "items",
    },
  },
};

export const MetadataSerializerOptions: Options = omit(SerializerOptions, [
  "topLevelLinks",
  "topLevelMeta",
  "relationships",
]);

export default SerializerOptions;
