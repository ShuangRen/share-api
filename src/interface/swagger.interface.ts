type Ttype = 'integer' | 'object' | 'string' | 'array'
type Tmethod = 'get' | 'post' | 'put' | 'delete' | 'head'
type Iin = 'path' | 'body' | 'query'

export interface Itag {
  name: string,
  description?: string,
}

export interface Iinfo {
  title: string,
  version: string,
  description: string,
}

/**
 *  definitions
 */

export interface Ifield {
  type: Ttype,
  format?: string,
  description?: string,
}

export interface Iresult {
  code: Ifield,
  data: {
    $ref: string,
  },
  resultMessage: Ifield
}

export interface IpageListData {
  items: {
    $ref: string,
  },
  type: Ttype
}

export interface IDAO {
  $ref: string,
  description?: string
}

export interface Ipagelist {
  data: IpageListData,
  code: Ifield,
  page: Ifield,
  pageSize: Ifield,
  resultMessage: Ifield,
  totalCount: Ifield
}

export interface Iitem extends Ifield {
  $ref: string,
}

export interface Ipropertie extends Ifield {
  items: Iitem
}

export interface Idefinition {
  type: Ttype,
  title: string,
  properties: {
    [key: string]: Ipropertie | Iresult | Ipagelist | IDAO
  },
  required?: string[],
}

export interface Idefinitions {
  [key: string]: Idefinition
}


/**
 *  paths
 */

export interface Iparameter extends Ifield {
  required: boolean,
  name: string,
  in: Iin,
  schema?: Ipropertie | Iitem
}

export interface Iresponses extends Ifield {
  schema?: Ipropertie | Iitem,
}

export interface IPath {
  deprecated: boolean,
  operationId: string,
  produces: string[],
  summary: string,
  tags: string[],
  parameters?: Iparameter[],
  consumes?: string[],
  responses: Iresponses
}

export interface IPaths {
  [key: string]: {
    [key in Tmethod]: IPath
  }
}


export interface Iswagger {
  basePath: string,
  host: string,
  definitions: Idefinitions,
  info: Iinfo,
  swagger: string,
  tags: Itag[],
  paths: IPaths,
  configName: string
}
