import { observable, action, autorun } from 'mobx';
import * as Api from '@/api/common.api';
import { ICommonStore, ICenterConfig } from './interface/common.interface';
import { Iswagger, Itag } from '@/interface/swagger.interface';
class Common implements ICommonStore {
  @observable public collapsed: boolean = false; // 展开收起
  @observable public apiDataList: Iswagger[] = []; // 所有swagger 数据 list
  @observable public center: Iswagger | null = null; // 当前的中心
  @observable public currentTag: string = ''; // 当前选中的 tag
  @observable public currentCenterConfig: ICenterConfig | null = null; // 当前的 中心 配置文件
  @observable public filterNav: Itag[] = []; // 筛选出来的  nav
  @observable public filterValue: string = ''; // 筛选出来的 string
  @observable public canOpen: boolean = false; // 是否开放权限
  @observable public enablePrivate: boolean = false; // 是否全局开启私有配置功能
  // todo
  @observable public detailItem: any = null;

  @observable public swaggerApiConfig: any = [];

  constructor() {
    autorun(() => {
      // 如果拿到了当前center 的配置， 以及有了apiDataList 匹配出 当前的 center
      if (this.currentCenterConfig && this.apiDataList.length > 0) {
        const findResult = this.apiDataList.find((item: Iswagger) => {
          if (!this.currentCenterConfig) {
            return false;
          }
          return item.configName.replace('/', '') === this.currentCenterConfig.name
        });
        // 当前的 center 数据
        this.center = findResult || null;
        // 当前的  筛选结果就是全部
        this.filterNav = this.center ? this.center.tags : [];
      }
    });
    autorun(() => {
      if (this.filterValue && this.center) {
        this.filterNav = this.center.tags.filter((v: any) => v.name.toLocaleLowerCase().indexOf(this.filterValue.toLocaleLowerCase()) !== -1);
      }
    })
  }
  @action public async logout() {
    const redirectUrl = decodeURIComponent(location.href);
    const requestUrl = location.origin + '/erp-gateway/logout?redirectUrl=' + redirectUrl;
    window.location.href = requestUrl;
    return true;
  }

  @action public getSwaggerDatas = () => {
    this.swaggerApiConfig.forEach((item: any, index: number) => {
      this.requestSwagger(item);
    })
    return true;
  }

  @action public requestSwagger = async (item: any) => {
    let result = null;
    try {
      result = await Api.requestSwagger<any>(item);
    } catch (e) {
      return false;
    }
    result.data.configName = item.name;
    if (!result.data.tags) {
      result.data.tags = [];
    }
    result.data.tags = this.mappingTags(result.data);
    this.apiDataList.push(result.data);
    return true;
  }

  @action public mappingTags = (result: any) => {
    const tags: any = [...result.tags];
    const res = { ...result };
    Object.keys(res.paths).forEach((v, i, a) => {
      Object.keys(res.paths[v]).forEach((item: any) => {

        const tagObj = res.paths[v][item].tags.map((tag: string) => {
          return {
            name: tag
          }
        })
        tags.push(...tagObj);
      })
    })
    const arr: any = [];
    const json = {};
    tags.forEach((v: any) => {
      if (!json[v.name]) {
        arr.push(v);
        json[v.name] = v;
      }
    })

    return arr;
  }

  @action public getSwaggerApiConfig = async () => {
    let result = null;
    try {
      result = await Api.getSwaggerApiConfig<any>();
    } catch (e) {
      return false;
    }
    this.canOpen = result.canOpen || false;
    this.enablePrivate = result.enablePrivate || false;
    this.swaggerApiConfig = result.data;
    this.getSwaggerDatas();

    // 从 url 里面 获取 当前 center  并从 配置种 读取  center 的 config
    let num = 3;
    if (window['scopePath']) {
      num = 4;
    }
    const center = location.href.split('/')[num];
    console.log(center);
    if (center) {
      this.currentCenterConfig = this.swaggerApiConfig.filter((v: any) => v.name === center)[0];
    } else {
      this.currentCenterConfig = this.swaggerApiConfig[0];
      if (this.currentCenterConfig) {
        try {
          history.replaceState(null, 'firstapi', `${window['scopePath'] ? '/' + window['scopePath'] : ''}/${this.currentCenterConfig.name}`);
        } catch (e) {
          return true;
        }
      }
    }

    return true;
  }

  @action public updateSwaggerApiConfig = async () => {
    try {
      await Api.updateSwaggerApiConfig<any>(this.swaggerApiConfig);
    } catch (e) {
      return false;
    }
    return true;
  }
}

// 外部使用require
export default new Common();
