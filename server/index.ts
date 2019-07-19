import App from './app';
import * as conf from './config';

export = class ApiDoc {
  public config(opts: { [key: string]: string | string[] }) {
    Object.keys(opts).forEach((v: string) => {
      conf[v] = opts[v]
    })
  }

  public start() {
    App();
  }
}