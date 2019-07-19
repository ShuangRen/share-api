import * as Koa from 'koa';
import * as fs from 'fs';
import { NextFunction } from 'connect';
import * as utils from './utils';
import * as conf from './config';
import { IConfig } from './interface'

export default (ctx: Koa.BaseContext, next: NextFunction) => {
  const clientIP = utils.getClientIP(ctx);
  let canOpen = true;
  let dataBuffer: Buffer;
  try {
    dataBuffer = fs.readFileSync(conf.dataPath);
  } catch (e) {

    try {
      fs.writeFileSync(conf.dataPath, JSON.stringify(conf.demo));
    } catch (e) {
      ctx.body = {
        code: 200,
        data: false,
        msg: e.message
      }
      return;
    }

    ctx.body = {
      code: 200,
      data: conf.demo,
      canOpen: true
    }
    return;
  }
  let data = JSON.parse(dataBuffer.toString());
  // 如果是外网，并且没有输入 password 的 筛选出允许外部访问的api
  if (conf.ipList.length > 0 && !conf.ipList.includes(clientIP) && ctx.query.password !== conf.password) {
    data = data.filter((v: IConfig) => v.isOpen);
    canOpen = false;
  }

  ctx.set('Content-Type', 'application/json');
  ctx.body = {
    code: 200,
    data: data,
    canOpen: canOpen
  }

}