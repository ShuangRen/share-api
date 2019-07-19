import * as Koa from 'koa';
import * as utils from './utils';

export default async (ctx: Koa.BaseContext) => {
  const result = await utils.curl({
    url: ctx.request.body.urls,
    headers: {
      "data-type": 'application/json',
    },
    timeout: 50000,
  });
  const resultData = result.body.replace(/\ufeff/g, '');

  ctx.body = {
    code: 200,
    data: JSON.parse(resultData)
  }
}
