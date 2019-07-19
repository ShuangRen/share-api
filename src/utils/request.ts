import Axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import createBrowserHistory from 'history/createBrowserHistory';
import { IRequestRes, IOpts } from '@/utils/request.interface';
// 代理名
const proxyName: string = '/api';
// 默认的参数
const defaultopts = {
  timeout: 20000,
};


interface IOAuthData {
  casLoginUrl?: string,
  appSecurityUrl?: string,
  appRedirectParameter?: string,
  casServiceParameter?: string,
}

// 添加一个响应拦截器 用来处理oauth 鉴权  1.2 版本
Axios.interceptors.response.use((res: AxiosResponse<IRequestRes<IOAuthData>>) => {
  const data = res.data;
  switch (data.code) {
    case 401:
      const {
        casLoginUrl,
        appSecurityUrl,
        appRedirectParameter,
        casServiceParameter
      } = data.data;

      const encodeUrl = `${appSecurityUrl}?${appRedirectParameter}=${encodeURIComponent(window.location.origin)}`;
      const loginUrl = `${casLoginUrl}?${casServiceParameter}=${encodeURIComponent(encodeUrl)}`;
      window.location.href = loginUrl;
      return res;
      break;
    case 403:
      createBrowserHistory().push('/noauthorize');
      return res;
      break;
    case 441:
      window.location.reload();
      break;
  }
  return res;
});


const Request = <T>(opts: IOpts, code?: number[]): Promise<T> => {
  // 默认method
  opts.method = (opts.method || 'GET').toLocaleUpperCase();
  // url 增加代理名
  if (!opts.notBasePath) {
    opts.url = proxyName + opts.url;
  }
  // 合并默认参数和业务参数
  opts.whitecode = code || null;
  opts = { ...defaultopts, ...opts };
  // 如果是post 请求 则 delete 掉 params key值 赋值给data
  if (opts.method !== 'GET') {
    opts.data = opts.params;
    delete opts.params;
  }


  // 返回一个promise 用来 await调用
  return new Promise((resolve, reject) => {
    Axios(opts).then((res: AxiosResponse<IRequestRes<T>>) => {

      const allData: T = JSON.parse(JSON.stringify(res.data)) as T;
      resolve(allData);

    }).catch((err) => {
      // 默认直接弹框报错
      message.error('网络繁忙，请稍后再试！');
      reject(err);
    });
  });

}


export default Request;