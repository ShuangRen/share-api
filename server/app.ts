import * as Koa from 'koa';
import * as send from 'koa-send';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as fs from 'fs';
import List from './list';
import Update from './update';
import GetApi from './getapi';
import * as conf from './config';
import { NextFunction } from 'connect';

export default () => {
  const router = new Router();

  const App = new Koa();

  App.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
  }));

  App.use(router.routes());
  App.use(router.allowedMethods());


  router.get('/share-api/list', List)
  router.post('/share-api/update', Update)
  router.post('/share-api/getapi', GetApi)

  router.get('/shareapi-static/*', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    await send(ctx, ctx.path, { root: `${__dirname}/../build/` });
  })

  router.get('/favicon.ico', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    await send(ctx, ctx.path, { root: `${__dirname}/../build/` });
  })

  router.get('/manifest.json', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    await send(ctx, ctx.path, { root: `${__dirname}/../build/` });
  })

  router.get('*', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    let template = fs.readFileSync(__dirname + '/../build/index.html', { encoding: 'utf-8' });
    if (conf.scopePath) {
      template = template.replace(/(\<meta charset\=\"utf\-8\"\>)/, '<script>window.scopePath="' + conf.scopePath + '"</script>$1')
    }
    ctx.body = template;
  })


  App.listen(conf.port, () => {
    console.log(`Server running on host http://localhost:${conf.port}`);
  });
}