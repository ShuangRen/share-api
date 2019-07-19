import * as React from 'react';
import {observer, inject} from 'mobx-react';
import Detail from './detail';

@inject('common')
@observer
export default class DetailHOC extends React.Component<any> {
  public render() {
    if (!this.props.common.center) {
      return null;
    }
    return <Detail />
  }
}