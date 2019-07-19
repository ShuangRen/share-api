import * as Koa from 'koa';
import * as fs from 'fs';
import * as conf from './config';

export default (ctx: Koa.BaseContext) => {
  try {
    fs.writeFileSync(conf.dataPath, JSON.stringify(ctx.request.body));
  } catch (e) {
    ctx.body = {
      code: 400,
      data: false,
      msg: e.message
    }
    return;
  }
  ctx.body = {
    code: 200,
    data: true
  }
}
