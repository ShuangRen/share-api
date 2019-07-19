import * as Koa from 'koa';
import * as Request from 'request';


export const getClientIP = (ctx: Koa.BaseContext) => {
  const req = ctx.req;
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};


export const curl = async (options: Request.Options): Promise<Request.Response> => {
  options.timeout = 30000;
  return await request(options);
}

const request = (options: Request.Options): Promise<Request.Response> => {
  return new Promise((resolve, reject) => {
    Request(options, (err: Error, req: Request.Response, body) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(req);
    })
  })
}
