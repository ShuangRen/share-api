import { Iswagger, Itag } from '@/interface/swagger.interface';
export interface IBreadcrumbs {
  url: string,
  title: string
}

export interface IUserInfo {
  employeeNo: string,
  name: string,
  observerId: number
}

export interface ICenterConfig {
  title: string,
  name: string,
  url: string,
  isOpen: boolean,
}


export interface ICommonStore {
  collapsed: boolean,
  apiDataList: Iswagger[];
  currentTag: string,
  currentCenterConfig: ICenterConfig | null
  center: Iswagger | null,
  filterNav: Itag[],
  filterValue: string,
  detailItem: any, // todo
  swaggerApiConfig: any,
  canOpen: boolean,
  logout: () => Promise<boolean>,
  getSwaggerDatas: () => boolean,
  requestSwagger: (item: any) => Promise<boolean>,
  getSwaggerApiConfig: () => Promise<boolean>,
  updateSwaggerApiConfig: () => Promise<boolean>
}