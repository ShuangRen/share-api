// 引入出index.js之外的全部文件
/// <reference path="../../node_modules/@types/webpack-env/index.d.ts" />
declare var require: __WebpackModuleApi.RequireFunction;

const store = {};
const setStore = (files: __WebpackModuleApi.RequireContext, matchreg: RegExp, exclude?: string) => {
  let fileNames: string[] = [];
  if (exclude) {
    fileNames = files.keys().filter((item: string) => item !== exclude);
  } else {
    fileNames = files.keys();
  }
  fileNames.map((item: string) => {
    const matchs: string[] | null = item.match(matchreg);

    if (!matchs || matchs.length < 2) {
      return false;
    }
    const attr = matchs[1];
    store[attr.toLocaleLowerCase()] = files(item).default;

    return true;
  });
}

const globalContext: __WebpackModuleApi.RequireContext = require.context('./', false, /\.ts$/);
const commonContext: __WebpackModuleApi.RequireContext = require.context('../containers', true, /\.store.ts$/);

setStore(globalContext, /([^\/]+)\.ts$/, './index.ts');
setStore(commonContext, /([^\/]+)\.store\.ts$/);

console.log(store);
export default store;
