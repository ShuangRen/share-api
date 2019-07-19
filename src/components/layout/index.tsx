import * as React from 'react';
import { TITLE_CONFIG } from 'config';
import * as PropTypes from 'prop-types';
import { Layout } from 'antd';
import Header from './header';
import Nav from './nav';
import commonStore from '@/store/common';

import './index.less';


export default class LayoutIndex extends React.Component {
  // 通过context 拿到 router 对象
  public static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    }).isRequired
  }

  public componentDidMount() {
    // 获取title 配置 以及拿到所有的title key
    const titles = TITLE_CONFIG;
    const titlesKey = Object.keys(titles);
    // 初始化先匹配一次
    this.onMappingTitles(titlesKey, titles);
    // listen 路由改变，重新匹配一次
    this.context.router.history.listen(() => {
      this.onMappingTitles(titlesKey, titles);
    });
  }

  public onMappingTitles = (titlesKey: string[], titles: object) => {
    // 得到所有和当前路由匹配的数组
    const arr = titlesKey.filter(v => new RegExp(v).test(this.context.router.history.location.pathname));
    // 设置title
    document.title = titles[arr[arr.length - 1]];
    if (!commonStore.currentCenterConfig) {
      commonStore.currentCenterConfig = commonStore.swaggerApiConfig.filter((v: any) => new RegExp(v.name).test(this.context.router.history.location.pathname))[0];
    }

  }

  public render() {
    return (
      <div className="layout-container">
        <Layout>
          <Nav common={commonStore} />
          <Layout>
            <Header common={commonStore} history={this.context.router.history} />
            <div className="layout-content-wrapper">
              <Layout.Content
                style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}
              >
                {this.props.children}
              </Layout.Content>
            </div>
          </Layout>
        </Layout>
      </div>
    );
  }
}
