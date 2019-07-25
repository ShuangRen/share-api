import * as Koa from 'koa';
import * as fs from 'fs';
import { NextFunction } from 'connect';
import * as utils from './utils';
import * as conf from './config';
import { IConfig } from './interface'

export default (ctx: Koa.BaseContext, next: NextFunction) => {
  const clientIP = utils.getClientIP(ctx);
  let canOpen = true;
  let dataBuffer: Buffer | null;
  // rep
  let data = null;
  let msg = null;
  try {
    dataBuffer = fs.readFileSync(conf.dataPath);
  } catch (e) {
    dataBuffer = null;
    try {
      fs.writeFileSync(conf.dataPath, JSON.stringify(conf.demo));
    } catch (e) {
      msg = e.message
    }

    data = conf.demo;
  }

  if (dataBuffer) {
    data = JSON.parse(dataBuffer.toString());
  }
  if (!data || data.length === 0) {
    data = conf.demo;
  }
  // 是否开启了 private 私有化配置
  if (conf.enablePrivate) {
    // 如果是外网，并且没有输入 password 的 筛选出允许外部访问的api
    if (!conf.ipList.includes(clientIP) && ctx.query.password !== conf.password) {
      data = data.filter((v: IConfig) => v.isOpen);
      canOpen = false;
    }
  }


  ctx.set('Content-Type', 'application/json');
  const body = {
    code: 200,
    data: data,
    canOpen: canOpen,
    enablePrivate: conf.enablePrivate
  }

  if (msg) {
    body['msg'] = msg;
  }
  ctx.body = body

}