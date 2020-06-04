declare module 'json-api-serializer' {
  interface RelationshipOptions {
    type: string;
    alternativeKey?: string;
    schema?: string;
    links?: ((data: object, extraData: object) => object) | object;
    meta?: ((data: object, extraData: object) => object) | object;
    deserialize?: (data: object) => object;
  }

  interface Options {
    id?: string;
    blacklist?: string[];
    whitelist?: string[];
    jsonapiObject?: boolean;
    links?: ((data: object, extraData: object) => object) | object;
    topLevelLinks?: ((data: object, extraData: object) => object) | object;
    topLevelMeta?: ((data: object, extraData: object) => object) | object;
    meta?: ((data: object, extraData: object) => object) | object;
    relationships?: {
      [x: string]: RelationshipOptions;
    };
    blacklistOnDeserialize?: string[];
    whitelistOnDeserialize?: string[];
    convertCase?: 'kebab-case' | 'snake_case' | 'camelCase';
    unconvertCase?: 'kebab-case' | 'snake_case' | 'camelCase';
    convertCaseCacheSize?: number;
    beforeSerialize?: (data: object) => object;
    afterDeserialize?: (data: object) => object;
  }

  interface DynamicTypeOptions {
    id: (data: object) => object | string;
    jsonapiObject?: boolean;
    topLevelLinks?: ((data: object, extraData: object) => object) | object;
    topLevelMeta?: ((data: object, extraData: object) => object) | object;
  }

  type ErrorWithStatus = Error;

  namespace JSONAPISerializer {
    export {
      RelationshipOptions,
      Options,
      ErrorWithStatus,
      DynamicTypeOptions,
    };
  }

  class JSONAPISerializer {
    constructor(opts?: Options);
    register(type: string, options?: Options): void;
    register(type: string, schema?: string, options?: Options): void;

    serialize(
      type: string | DynamicTypeOptions,
      data: object | object[],
      schema?: string | object,
      extraData?: object,
      excludeData?: boolean,
      overrideSchemaOptions?: object,
    ): any;

    serializeAsync(
      type: string | DynamicTypeOptions,
      data: object | object[],
      schema?: string,
      extraData?: object,
      excludeData?: boolean,
      overrideSchemaOptions?: object,
    ): Promise<any>;

    deserialize(
      type: string | DynamicTypeOptions,
      data: object,
      schema?: string,
    ): any;

    deserializeAsync(
      type: string | DynamicTypeOptions,
      data: object,
      schema?: string,
    ): Promise<any>;

    serializeError(
      error:
        | Error
        | Error[]
        | ErrorWithStatus
        | ErrorWithStatus[]
        | object
        | object[],
    ): Promise<any>;
  }

  export = JSONAPISerializer;
}
