import * as React from 'react';
import { List, Tag } from 'antd';
import { observer, inject } from 'mobx-react';
import './list.less';
import RightCode from './right';
import classnamse from 'classnames';

@inject('common')
@observer
export default class ListPage extends React.Component<any, any> {
  public state = {
    item: null,
    base: '',
    method: '',
    list: null,
    url: ''
  }

  public onShow = (item: any, method: string, base: string, list: any, url: string) => {
    this.setState({
      item: null,
      base: '',
      method: '',
      list: null,
      url: ''
    })
    console.log(item);
    setTimeout(() => {
      this.setState({
        item,
        method,
        base,
        list,
        url,
      });
    }, 0);
  }
  public componentDidMount() {
    if (!this.props.common.currentTag) {
      this.props.common.currentTag = this.props.match.params.tag;
    }
  }
  public UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.currentTag !== this.props.common.currentTag) {
      this.setState({
        item: null,
        base: '',
        method: '',
        list: null
      });
    }
  }
  public render() {
    const center = this.props.common.center
    if (!center) {
      return null;
    }
    return (
      <div className="list-container">
        <div className="left flex">
          <h1>{center.info.title}</h1>
          <h2>{center.basePath}</h2>
          {
            Object.keys(center.paths).map((path: any, pathIndex: number) => {
              return Object.keys(center.paths[path]).map((method: any, apiIndex: number) => {
                if (!center.paths[path][method].tags.includes(this.props.common.currentTag)) {
                  return null;
                }
                const listClassName = classnamse('list-box', method.toLocaleLowerCase(), {deprecated : center.paths[path][method].deprecated});
                return (
                  <div className={listClassName} key={pathIndex + apiIndex} onClick={this.onShow.bind(this, center.paths[path][method], method, center.basePath, center, path)}>
                    <List.Item className={method}>
                      <List.Item.Meta
                        avatar={<div className="method-tag">{method.toLocaleUpperCase()}</div>}
                        title={<a href="javascript:;">{center.paths[path][method].summary}&nbsp;&nbsp;{center.paths[path][method].deprecated && <Tag color="red">已弃用</Tag> }</a>}
                        description={path}
                      />
                    </List.Item>
                  </div>
                )
              })
            })
          }
        </div>

        {
          this.state.item && (
            <div className="right-wrapper flex">
              <RightCode item={this.state.item} base={this.state.base} method={this.state.method} data={this.state.list} url={this.state.url} />
            </div>
          )
        }
      </div>
    )
  }
}