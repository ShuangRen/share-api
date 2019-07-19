import * as React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider, observer } from "mobx-react";
import Layout from './components/layout/index';
import routes from './routers';
import store from './store';
import commonStore from "./store/common";


// 获取用户信息
commonStore.getSwaggerApiConfig();

const ObserverRender = observer(() => {
  return (
    commonStore.apiDataList.length > 0 ?
      renderRoutes(routes) :
      <div />
  )
})

export default () => {
  return (
    <Provider {...store}>
      <BrowserRouter>
        <Layout>
          <Switch>
            <ObserverRender />
          </Switch>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};
