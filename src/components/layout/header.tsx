import * as React from 'react';
import classnames from 'classnames';
import { List, Input, Layout, Select, Button, Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { IProps } from './interface/header.interface';
import { EventHandler } from 'utils'
import './header.less';


@inject('common')
@observer
export default class Header extends React.Component<IProps, any> {
  public state = {
    inputValue: '',
    listData: [],
    isFocus: true,
    isSelected: null,
    isNumber: -1,
    visible: false,
    password: ''
  }
  public componentDidMount() {
    // 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
    EventHandler.add(this.globalClick);
    // 键盘事件
    document.addEventListener('keydown', this.handleOnKeyDown, false)
  }
  // 全局点击
  public globalClick = () => {
    this.setState({
      isSelected: null,
      isNumber: -1,
    }, () => {
      this.setState({
        listData: [],
      })
    });
  }

  public handleChange = (item: any) => {
    this.props.common.filterValue = '';
    this.props.common.currentCenterConfig = this.props.common.swaggerApiConfig.filter((v: any) => v.name === item)[0];
    this.props.history.push('/' + item);
  }

  public handleChangeInput = (ev: any) => {
    const data = ev.target.value ? this.filterList(ev.target.value) : [];
    console.log(data);
    this.setState({
      inputValue: ev.target.value,
      listData: data,
    });
  }

  public handleFocusInput = (ev: any) => {
    ev.stopPropagation();
    this.handleChangeInput({ target: { value: this.state.inputValue } })
    this.setState({
      isSelected: null,
      isNumber: -1,
    })
  }
  public handleOnKeyDown = (ev: any) => {
    if (!this.state.listData.length) {
      return false;
    }


    const upkey = ev.keyCode === 38;
    const downkey = ev.keyCode === 40;
    const enterKey = ev.keyCode === 13;
    if (!upkey && !downkey && !enterKey) {
      return false;
    }

    if (enterKey) {
      if (this.state.listData.length && this.state.isNumber > -1) {
        this.onGoToDetail(this.state.isSelected);
      }
      return;
    }
    let num = 0;

    if (downkey) {
      num = this.state.isNumber + 1;
      if (this.state.isNumber === this.state.listData.length - 1) {
        num = 0;
      }
    }

    if (upkey) {
      num = this.state.isNumber - 1;
      if (this.state.isNumber === 0) {
        num = this.state.listData.length - 1;
      }
    }

    this.setState({
      isSelected: this.state.listData[num],
      isNumber: num,
    })

    return true;
  }
  public handleClickInput = (ev: any) => {
    ev.stopPropagation();
  }

  public handlePassword = () => {
    this.setState({
      visible: true
    })
  }

  public handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value
    })
  }

  public handleOk = () => {
    sessionStorage.setItem('password', this.state.password);
    window.location.reload();
  }

  public handleClickClose = () => {
    this.setState({
      visible: false
    })
  }

  public filterList = (value: string) => {
    let arr: any[] = [];
    this.props.common.apiDataList.forEach((list: any) => {
      Object.keys(list.paths).forEach((v: string) => {
        if (v.indexOf(value) !== -1) {
          if (arr.length >= 5) {
            return;
          }
          arr = [...arr, { item: list.paths[v], url: v, base: list.basePath, data: list }];
        }
      })
    })

    const result: any[] = [];
    arr.forEach((list: any) => {
      Object.keys(list.item).forEach((item: any) => {
        if (result.length >= 5) {
          return;
        }
        if (list.item[item].deprecated) {
          return;
        }
        result.push({
          method: item,
          url: list.url,
          ...list.item[item],
          base: list.base,
          data: list.data,
        })
      });
    })

    return result;
  }

  public onGoToDetail = (item: any) => {
    this.props.common.detailItem = null
    this.props.history.push(`${item.base}/detail?url=${encodeURIComponent(item.url)}&method=${item.method.toLocaleLowerCase()}`);
    this.setState({
      listData: []
    });
    setTimeout(() => {
      this.props.common.detailItem = item;
      this.props.common.center = item.data;
    }, 0);
  }

  public renderListItem = (item: any) => {
    if (item.deprecated) {
      return <React.Fragment />;
    }
    let classNames = classnames(item.method.toLocaleLowerCase());
    const selected: any = this.state.isSelected;
    if (selected && selected.summary) {
      classNames = classnames(item.method.toLocaleLowerCase(), { isActivity: selected.url === item.url && selected.summary === item.summary && selected.method === item.method })
    }
    return (
      <div onClick={this.onGoToDetail.bind(this, item)}>
        <List.Item className={classNames}>
          <List.Item.Meta
            avatar={<div className="method-tag">{item.method.toLocaleUpperCase()}</div>}
            title={<a href="javascript:;">{item.url}</a>}
            description={item.summary}
          />
        </List.Item>
      </div>
    )
  }

  public handleGoToSetting = () => {
    this.props.history.push('/setting');
  }

  public render() {
    console.log(this.props.common.canOpen)
    // if (!this.props.common.currentCenterConfig) {
    //   return null;
    // }
    return (
      <Layout.Header style={{ background: '#fff' }} className="layout-header-wrapper">
        <div className="header-input-group">
          <Select
            defaultValue={this.props.common.currentCenterConfig ? this.props.common.currentCenterConfig.title : undefined}
            style={{ width: 160, marginRight: 20 }}
            onChange={this.handleChange}
            value={this.props.common.currentCenterConfig ? this.props.common.currentCenterConfig.title : undefined}
          >
            {
              this.props.common.swaggerApiConfig.map((item: any, index: number) => {
                return (
                  <Select.Option value={item.name} key={index.toString()}>{item.title}</Select.Option>
                )
              })
            }
          </Select>
          <div className="input-group">
            <Input
              placeholder="输入接口名称"
              value={this.state.inputValue}
              onChange={this.handleChangeInput}
              onFocus={this.handleFocusInput}
              onClick={this.handleClickInput}
              className="search-input"
            />
            {
              this.state.listData.length > 0 && (
                <div className="search-list-wrapper">
                  <List
                    itemLayout="horizontal"
                    dataSource={this.state.listData}
                    renderItem={this.renderListItem}
                  />
                </div>
              )
            }
          </div>
        </div>
        <div className="right">
          {
            !this.props.common.canOpen && <Button type="primary" onClick={this.handlePassword}>内部访问</Button>
          }
          {
            this.props.common.canOpen && <Button type="primary" onClick={this.handleGoToSetting}>配置</Button>
          }
        </div>
        {
          this.state.visible && (
            <Modal
              title="输入访问密码"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleClickClose}
            >
              <Input.Password placeholder="输入访问密码获取内部权限"
                value={this.state.password}
                onChange={this.handleChangePassword} />
            </Modal>
          )
        }
      </Layout.Header>
    );
  }
}