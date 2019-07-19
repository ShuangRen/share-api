import * as React from 'react';
import {observer, inject} from 'mobx-react';
import RightCode from './right';
import {getQueryString} from 'utils'
import './right.less';

@inject('common')
@observer
export default class Detail extends React.Component<any> {
  public componentDidMount() {
    this.mapDetailItem();
  }
  public mapDetailItem = () => {
    const common = this.props.common;
    if (!common.center) {
      return null;
    }

    if (!common.detailItem) {
      const url = decodeURIComponent(getQueryString('url') || '');
      const method = getQueryString('method') || '';
      console.log(common.center)
      if (!common.center.paths[url]) {
        return null;
      }
      const items = common.center.paths[url][method];
      console.log(items)
      common.detailItem = {
        method: method,
        url: url,
        ...items,
        base: common.center.basePath,
        data: common.center,
      }

      console.log(common.detailItem);
    }

    return true;
  }

  public render() {
    if (!this.props.common.detailItem) {
      return null;
    }
    const item = this.props.common.detailItem;
    return (
      <div className="detail-container right-container">
        <RightCode item={item} base={item.base} method={item.method} data={item.data} url={item.url} />
      </div>
    )
  }
}