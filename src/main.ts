type OpenApiRoute = {
  parameters?: Readonly<ParamData[]>;
} & Record<string, unknown>;
type OpenApiMethods = Record<string, OpenApiRoute>;
type OpenApiPaths = Record<string, OpenApiMethods>;
type OpenApiSpec = {
  paths: OpenApiPaths;
};

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

type Parsed<T extends OpenApiSpec, Paths extends OpenApiPaths = T['paths']> = 
    {[K in keyof Paths]: ParsePath<K, Paths[K]>}[keyof Paths];

type ParsePath<
  Path,
  Methods extends OpenApiMethods
> =
  Path extends string ? {
    [Method in keyof Methods]: ParseMethod<Path, Method, Methods[Method]>
  }[keyof Methods] : never

type ParseMethod<
  Path extends string,
  Method,
  MethodData extends OpenApiRoute,
> = 
  Method extends string ? {
    [key in `${Uppercase<Method>} ${Path}`]: {
      parameters: Writeable<MethodData['parameters']> extends ParamData[] ? Prettify<ParseParameters<Writeable<MethodData['parameters']>>> : undefined;
    };
  } : never;

type ParamData = {
  name: string;
  in: string;
  description: string;
  required: boolean;
  schema: {
    "type": string;
  };
};

type ParseParameters<Params extends ParamData[]> = {[K in keyof Params]: ParseParameter<Params[K]>}[number]

type ParseParameter<
  Param extends ParamData,
  Key extends string = Param['name'],
  Type = Param['schema']['type'] extends 'string' ? string : "idfk"
> =
  Param['required'] extends true ? {
    [key in Key]: Type;
  } : {
    [key in Key]?: Type;
  };

type A = Parsed<typeof EXAMPLE_OPEN_API_SPEC>;
//   ^?

type A1 = Prettify<Parsed<typeof EXAMPLE_OPEN_API_SPEC>>;
//   ^?

type B = Parsed<typeof EXAMPLE_OPEN_API_SPEC2>;
//   ^?

export type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>
} & {};

const EXAMPLE_OPEN_API_SPEC = {
  "openapi": "3.0.1",
  "info": {
    "title": "Machines API",
    "description": "This site hosts documentation generated from the Fly.io Machines API OpenAPI specification. Visit our complete [Machines API docs](https://fly.io/docs/machines/api/) for how to get started, more information about each endpoint, parameter descriptions, and examples.",
    "contact": {},
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "1.0"
  },
  "externalDocs": {
    "url": "https://fly.io/docs/machines/working-with-machines/"
  },
  "servers": [
    {
      "url": "https://api.machines.dev/v1"
    }
  ],
  "tags": [
    {
      "name": "Apps",
      "description": "This site hosts documentation generated from the Fly.io Machines API OpenAPI specification. Visit our complete [Machines API docs](https://fly.io/docs/machines/api/apps-resource/) for details about using the Apps resource."
    }
  ],
  "paths": {
    "/apps": {
      "get": {
        "tags": [
          "Apps"
        ],
        "summary": "List Apps",
        "description": "List all apps with the ability to filter by organization slug.\n",
        "operationId": "Apps_list",
        "parameters": [
          {
            "name": "org_slug",
            "in": "query",
            "description": "The org slug, or 'personal', to filter apps",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ListAppsResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Apps"
        ],
        "summary": "Create App",
        "description": "Create an app with the specified details in the request body.\n",
        "operationId": "Apps_create",
        "requestBody": {
          "description": "App body",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateAppRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {}
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        },
        "x-codegen-request-body-name": "request"
      }
    },
    "/apps/{app_name}/machines/{machine_id}/start": {
      "post": {
        "tags": [
          "Machines"
        ],
        "summary": "Start Machine",
        "description": "Start a specific Machine within an app.\n",
        "operationId": "Machines_start",
        "parameters": [
          {
            "name": "app_name",
            "in": "path",
            "description": "Fly App Name",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "machine_id",
            "in": "path",
            "description": "Machine ID",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {}
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "App": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "organization": {
            "$ref": "#/components/schemas/Organization"
          },
          "status": {
            "type": "string"
          }
        }
      },
      "CreateAppRequest": {
        "type": "object",
        "properties": {
          "app_name": {
            "type": "string"
          },
          "enable_subdomains": {
            "type": "boolean"
          },
          "network": {
            "type": "string"
          },
          "org_slug": {
            "type": "string"
          }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "details": {
            "type": "object",
            "description": "Deprecated"
          },
          "error": {
            "type": "string"
          },
          "status": {
            "$ref": "#/components/schemas/main.statusCode"
          }
        }
      },
      "ListApp": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "machine_count": {
            "type": "integer"
          },
          "name": {
            "type": "string"
          },
          "network": {
            "type": "object"
          }
        }
      },
      "ListAppsResponse": {
        "type": "object",
        "properties": {
          "apps": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ListApp"
            }
          },
          "total_apps": {
            "type": "integer"
          }
        }
      },
      "Organization": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "slug": {
            "type": "string"
          }
        }
      }
    }
  },
  "x-original-swagger-version": "2.0"
} as const;

const EXAMPLE_OPEN_API_SPEC2 = {
  "openapi": "3.0.1",
  "info": {
    "title": "Machines API",
    "description": "This site hosts documentation generated from the Fly.io Machines API OpenAPI specification. Visit our complete [Machines API docs](https://fly.io/docs/machines/api/) for how to get started, more information about each endpoint, parameter descriptions, and examples.",
    "contact": {},
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "1.0"
  },
  "externalDocs": {
    "url": "https://fly.io/docs/machines/working-with-machines/"
  },
  "servers": [
    {
      "url": "https://api.machines.dev/v1"
    }
  ],
  "tags": [
    {
      "name": "Apps",
      "description": "This site hosts documentation generated from the Fly.io Machines API OpenAPI specification. Visit our complete [Machines API docs](https://fly.io/docs/machines/api/apps-resource/) for details about using the Apps resource."
    }
  ],
  "paths": {
    "/apps/{app_name}/machines/{machine_id}/start": {
      "post": {
        "tags": [
          "Machines"
        ],
        "summary": "Start Machine",
        "description": "Start a specific Machine within an app.\n",
        "operationId": "Machines_start",
        "parameters": [
          {
            "name": "app_name",
            "in": "path",
            "description": "Fly App Name",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "machine_id",
            "in": "path",
            "description": "Machine ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {}
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "App": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "organization": {
            "$ref": "#/components/schemas/Organization"
          },
          "status": {
            "type": "string"
          }
        }
      },
      "CreateAppRequest": {
        "type": "object",
        "properties": {
          "app_name": {
            "type": "string"
          },
          "enable_subdomains": {
            "type": "boolean"
          },
          "network": {
            "type": "string"
          },
          "org_slug": {
            "type": "string"
          }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "details": {
            "type": "object",
            "description": "Deprecated"
          },
          "error": {
            "type": "string"
          },
          "status": {
            "$ref": "#/components/schemas/main.statusCode"
          }
        }
      },
      "ListApp": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "machine_count": {
            "type": "integer"
          },
          "name": {
            "type": "string"
          },
          "network": {
            "type": "object"
          }
        }
      },
      "ListAppsResponse": {
        "type": "object",
        "properties": {
          "apps": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ListApp"
            }
          },
          "total_apps": {
            "type": "integer"
          }
        }
      },
      "Organization": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "slug": {
            "type": "string"
          }
        }
      }
    }
  },
  "x-original-swagger-version": "2.0"
} as const;
