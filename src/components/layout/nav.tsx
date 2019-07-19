import * as React from 'react'
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { Layout, Input, Menu } from 'antd';
import classnames from 'classnames';
import { IState } from './interface/nav.interface';
import { ICommonStore } from '@/store/interface/common.interface';
import './nav.less';
const { Sider } = Layout;

@observer
export default class Nav extends React.Component<{ common: ICommonStore }, IState> {
  public static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  }
  // 为了兼容notfound 的情况 先为空数组
  public state = {
    collapsed: false,
    openKeys: [''],
    rootSubmenuKeys: [''],
    defaultSelectedKeys: []
  }

  public onGoToList = (tag: any) => {
    this.props.common.currentTag = tag.name;
    if (this.props.common.currentCenterConfig) {
      this.context.router.history.push(`/${this.props.common.currentCenterConfig.name}/list/${tag.name}`)
    }
  }


  public handleChange = (ev: any) => {
    this.props.common.filterValue = ev.target.value;

    if (!ev.target.value) {
      this.props.common.filterNav = this.props.common.center ? this.props.common.center.tags : [];
    }
  }

  public render() {
    if (!this.props.common.filterNav) {
      return null;
    }
    const collapsed = classnames('layout-nav-logo', { 'collapsed': this.props.common.collapsed });
    return (
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={this.props.common.collapsed}
        className="layout-sider"
      >
        <header className={collapsed}>
          <img src={require('../../images/logo.png')} />
          <span>SHARE-API</span>
        </header>
        <div className="search-wrapper">
          <Input placeholder="输入模块名称" value={this.props.common.filterValue} onChange={this.handleChange} />
          {/* <Select
						showSearch
						value={this.state.value}
						placeholder='输入模块名称'
						defaultActiveFirstOption={false}
						showArrow={false}
						filterOption={false}
						onSearch={this.handleSearch}
						onChange={this.handleChange}
						notFoundContent={null}
					>
						{options}
					</Select> */}
        </div>
        <div className="nav-api-list">
          <div className="dl">
            <Menu
              style={{ width: 256 }}
              mode="vertical"
              theme="light"
            >
              {
                this.props.common.filterNav.map((tag: any, tagsIndex: number) => {
                  return (
                    <Menu.Item key={tagsIndex} onClick={this.onGoToList.bind(this, tag)}>
                      {tag.name}
                    </Menu.Item>
                  )
                })
              }
            </Menu>
          </div>
        </div>
      </Sider>
    )
  }
}