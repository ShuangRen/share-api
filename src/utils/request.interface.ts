export interface IOpts {
  url: string,
  method?: string,
  params?: object,
  data?: object,
  headers?: object,
  timeout?: number,
  whitecode?: number[] | null,
  notBasePath?: boolean,
  loading?: boolean,
  getAll?: boolean,
}

export interface IRequestRes<T> {
  code: number,
  data: T,
  resultMessage?: string,
  message?: string,
}

export interface IRequestResWithPage<T> extends IRequestRes<T> {
  totalCount: number,
  page: number,
  pageSize: number,
}