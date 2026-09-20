// @ts-nocheck
/* eslint eslint-comments/no-unlimited-disable: off */
/* eslint-disable */
// This document was generated automatically by openapi-box

/**
 * @typedef {import('@sinclair/typebox').TSchema} TSchema
 */

/**
 * @template {TSchema} T
 * @typedef {import('@sinclair/typebox').Static<T>} Static
 */

/**
 * @typedef {import('@sinclair/typebox').SchemaOptions} SchemaOptions
 */

/**
 * @typedef {{
 *  [Path in keyof typeof schema]: {
 *    [Method in keyof typeof schema[Path]]: {
 *      [Prop in keyof typeof schema[Path][Method]]: typeof schema[Path][Method][Prop] extends TSchema ?
 *        Static<typeof schema[Path][Method][Prop]> :
 *        undefined
 *    }
 *  }
 * }} SchemaType
 */

/**
 * @typedef {{
 *  [ComponentType in keyof typeof _components]: {
 *    [ComponentName in keyof typeof _components[ComponentType]]: typeof _components[ComponentType][ComponentName] extends TSchema ?
 *      Static<typeof _components[ComponentType][ComponentName]> :
 *      undefined
 *  }
 * }} ComponentType
 */

import { Type as T, TypeRegistry, Kind, CloneType } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

/**
 * @typedef {{
 *  [Kind]: 'Binary'
 *  static: string | File | Blob | Uint8Array
 *  anyOf: [{
 *    type: 'object',
 *    additionalProperties: true
 *  }, {
 *    type: 'string',
 *    format: 'binary'
 *  }]
 * } & TSchema} TBinary
 */

/**
 * @returns {TBinary}
 */
const Binary = () => {
  /**
   * @param {TBinary} schema
   * @param {unknown} value
   * @returns {boolean}
   */
  function BinaryCheck(schema, value) {
    const type = Object.prototype.toString.call(value)
    return (
      type === '[object Blob]' ||
      type === '[object File]' ||
      type === '[object String]' ||
      type === '[object Uint8Array]'
    )
  }

  if (!TypeRegistry.Has('Binary')) TypeRegistry.Set('Binary', BinaryCheck)

  return /** @type {TBinary} */ ({
    anyOf: [
      {
        type: 'object',
        additionalProperties: true
      },
      {
        type: 'string',
        format: 'binary'
      }
    ],
    [Kind]: 'Binary'
  })
}

const ComponentsSchemasUser = T.Object({
  id: T.Integer({ format: 'int32' }),
  email: T.String(),
  name: T.Optional(T.String())
})
const ComponentsSchemasAuthResponse = T.Object({
  token: T.String(),
  user: CloneType(ComponentsSchemasUser)
})
const ComponentsSchemasValidationDetail = T.Object({
  field: T.String(),
  message: T.String()
})
const ComponentsSchemasError = T.Object({
  code: T.Integer({ format: 'int32' }),
  message: T.String()
})
const ComponentsSchemasValidationError = T.Intersect([
  CloneType(ComponentsSchemasError),
  T.Object({
    details: T.Optional(T.Array(CloneType(ComponentsSchemasValidationDetail)))
  })
])
const ComponentsSchemasLoginRequest = T.Object({
  email: T.String({ format: 'email' }),
  password: T.String()
})
const ComponentsSchemasRegisterRequest = T.Object({
  email: T.String({ format: 'email' }),
  password: T.String({ minLength: 8 })
})
const ComponentsSchemasCategory = T.Object({
  id: T.Integer({ format: 'int32' }),
  name: T.String()
})
const ComponentsSchemasMoney = T.Integer({ format: 'int32', minimum: 0 })
const ComponentsSchemasCatalogQuery = T.Object({
  categoryId: T.Optional(T.Integer({ format: 'int32' })),
  search: T.Optional(T.String()),
  priceFrom: T.Optional(CloneType(ComponentsSchemasMoney)),
  priceTo: T.Optional(T.Integer({ format: 'int32', minimum: 0 })),
  onlyAvailable: T.Optional(T.Boolean()),
  page: T.Optional(T.Integer({ format: 'int32', minimum: 1 })),
  pageSize: T.Optional(T.Integer({ format: 'int32', minimum: 1, maximum: 100 }))
})
const ComponentsSchemasProduct = T.Object({
  id: T.Integer({ format: 'int32' }),
  name: T.String(),
  price: T.Integer({ format: 'int32', minimum: 0 }),
  description: T.String(),
  image: T.Union([T.String(), T.Null()]),
  isAccessible: T.Boolean(),
  categoryId: T.Integer({ format: 'int32' })
})
const ComponentsSchemasProductList = T.Object({
  items: T.Array(CloneType(ComponentsSchemasProduct)),
  total: T.Integer({ format: 'int32' }),
  page: T.Integer({ format: 'int32' }),
  pageSize: T.Integer({ format: 'int32' }),
  totalPages: T.Integer({ format: 'int32' })
})

const schema = {
  '/auth/login': {
    POST: {
      args: T.Object({
        body: CloneType(ComponentsSchemasLoginRequest, {
          'x-content-type': 'application/json'
        })
      }),
      data: CloneType(ComponentsSchemasAuthResponse, {
        'x-status-code': '200',
        'x-content-type': 'application/json'
      }),
      error: T.Union([
        T.Union(
          [
            CloneType(ComponentsSchemasValidationError),
            CloneType(ComponentsSchemasError)
          ],
          { 'x-status-code': 'default', 'x-content-type': 'application/json' }
        )
      ])
    }
  },
  '/auth/logout': {
    POST: {
      args: T.Void(),
      data: T.Any({ 'x-status-code': '204' }),
      error: T.Union([
        CloneType(ComponentsSchemasError, {
          'x-status-code': 'default',
          'x-content-type': 'application/json'
        })
      ])
    }
  },
  '/auth/me': {
    GET: {
      args: T.Void(),
      data: T.Object(
        {
          id: T.Integer({ format: 'int32' }),
          email: T.String(),
          name: T.Optional(T.String())
        },
        {
          'x-status-code': '200',
          'x-content-type': 'application/json'
        }
      ),
      error: T.Union([
        CloneType(ComponentsSchemasError, {
          'x-status-code': 'default',
          'x-content-type': 'application/json'
        })
      ])
    }
  },
  '/auth/register': {
    POST: {
      args: T.Object({
        body: CloneType(ComponentsSchemasRegisterRequest, {
          'x-content-type': 'application/json'
        })
      }),
      data: CloneType(ComponentsSchemasAuthResponse, {
        'x-status-code': '200',
        'x-content-type': 'application/json'
      }),
      error: T.Union([
        T.Union(
          [
            CloneType(ComponentsSchemasValidationError),
            CloneType(ComponentsSchemasError)
          ],
          { 'x-status-code': 'default', 'x-content-type': 'application/json' }
        )
      ])
    }
  },
  '/catalog/categories': {
    GET: {
      args: T.Void(),
      data: T.Array(CloneType(ComponentsSchemasCategory), {
        'x-status-code': '200',
        'x-content-type': 'application/json'
      }),
      error: T.Union([
        CloneType(ComponentsSchemasError, {
          'x-status-code': 'default',
          'x-content-type': 'application/json'
        })
      ])
    }
  },
  '/catalog/products': {
    GET: {
      args: T.Object({
        query: T.Object({
          query: CloneType(ComponentsSchemasCatalogQuery, { 'x-in': 'query' })
        })
      }),
      data: CloneType(ComponentsSchemasProductList, {
        'x-status-code': '200',
        'x-content-type': 'application/json'
      }),
      error: T.Union([
        T.Union(
          [
            CloneType(ComponentsSchemasValidationError),
            CloneType(ComponentsSchemasError)
          ],
          { 'x-status-code': 'default', 'x-content-type': 'application/json' }
        )
      ])
    }
  }
}

const _components = {
  schemas: {
    AuthResponse: CloneType(ComponentsSchemasAuthResponse),
    CatalogQuery: CloneType(ComponentsSchemasCatalogQuery, { 'x-in': 'query' }),
    Category: CloneType(ComponentsSchemasCategory),
    Error: CloneType(ComponentsSchemasError),
    LoginRequest: CloneType(ComponentsSchemasLoginRequest),
    Money: T.Integer({ format: 'int32', minimum: 0 }),
    Product: CloneType(ComponentsSchemasProduct),
    ProductList: CloneType(ComponentsSchemasProductList),
    RegisterRequest: CloneType(ComponentsSchemasRegisterRequest),
    User: T.Object({
      id: T.Integer({ format: 'int32' }),
      email: T.String(),
      name: T.Optional(T.String())
    }),
    ValidationDetail: CloneType(ComponentsSchemasValidationDetail),
    ValidationError: CloneType(ComponentsSchemasValidationError)
  }
}

export { schema, _components as components }
