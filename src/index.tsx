/// <reference path="../node_modules/@types/webpack-env/index.d.ts" />
declare var module: __WebpackModuleApi.Module
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import './reset.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';

if (process.env.NODE_ENV === "development") {
  ReactDOM.render(
    <AppContainer>
      <LocaleProvider locale={zh_CN}>
        <App />
      </LocaleProvider>
    </AppContainer>,
    document.getElementById('root') as HTMLElement
  );
  if (module.hot) {
    module.hot.accept();
  }
}


if (process.env.NODE_ENV === "production") {
  ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
      <App />
    </LocaleProvider>,
    document.getElementById('root') as HTMLElement
  );
}

// registerServiceWorker();
