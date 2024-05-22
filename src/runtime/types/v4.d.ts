import type { StrapiLocale } from '.'

export interface Strapi4Error {
  error: {
    status: number
    name: string
    message: string
    details: Record<string, unknown>
  }
}

export interface PaginationByPage {
  page: number
  pageSize: number
  withCount?: boolean
}

export interface PaginationByOffset {
  start: number
  limit: number
  withCount?: boolean
}

/************************************************/
/* GET /api/:pluralApiId?filters[field][operator]=value */
/* Operator	Description
- $eq	Equal
- $eqi	Equal (case-insensitive)
- $ne	Not equal
- $nei	Not equal (case-insensitive)
- $lt	Less than
- $lte	Less than or equal to
- $gt	Greater than
- $gte	Greater than or equal to
- $in	Included in an array
- $notIn	Not included in an array
- $contains	Contains
- $notContains	Does not contain
- $containsi	Contains (case-insensitive)
- $notContainsi	Does not contain (case-insensitive)
- $null	Is null
- $notNull	Is not null
- $between	Is between
- $startsWith	Starts with
- $startsWithi	Starts with (case-insensitive)
- $endsWith	Ends with
- $endsWithi	Ends with (case-insensitive)
- $or	Joins the filters in an "or" expression
- $and	Joins the filters in an "and" expression
- $not	Joins the filters in an "not" expression */
/************************************************/

/* https://docs.strapi.io/dev-docs/api/rest/populate-select */

export interface Strapi4RequestParams {
  fields?: Array<string>
  populate?: string | Array<string> | object
  sort?: string | Array<string> // asc | desc
  pagination?: PaginationByOffset | PaginationByPage
  filters?: Record<string, unknown>
  publicationState?: 'live' | 'preview'
  locale?: StrapiLocale
}

export interface Strapi4ResponseData<T> {
  id: number
  attributes: T
  meta: Record<string, unknown>
}

export interface Strapi4Response<T> {
  data: Strapi4ResponseData<T> | Strapi4ResponseData<T>[]
  meta: Strapi4ResponseMeta
}

export interface Strapi4ResponseSingle<T> {
  data: Strapi4ResponseData<T>
  meta: Strapi4ResponseMeta
}

export interface Strapi4ResponseMany<T> {
  data: Strapi4ResponseData<T>[]
  meta: Strapi4ResponseMeta
}

export interface Strapi4ResponseMeta {
  pagination: MetaResponsePaginationByPage | MetaResponsePaginationByOffset
  [key: string]: unknown
}

export interface MetaResponsePaginationByPage {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface MetaResponsePaginationByOffset {
  start: number
  limit: number
  total: number
}
