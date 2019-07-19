import * as React from 'react';
import { Table } from 'antd';

const columns = [{
  title: 'Code',
  dataIndex: 'code',
  key: 'code',
}, {
  title: '说明',
  dataIndex: 'description',
  key: 'description',
}]

export default class CodeTable extends React.Component<any, any> {
  public state = {
    data: []
  }
  public componentDidMount() {
    this.mappingState();
  }
  public mappingState = () => {
    const data: any[] = [];
    Object.keys(this.props.items).forEach((v: any) => {
      data.push({
        code: v,
        ...this.props.items[v],
        key: v
      })
    });

    this.setState({
      data,
    })
  }
  public UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.items !== this.props.items) {
      this.mappingState();
    }
  }
  public render() {
    if (this.state.data.length === 0) {
      return null;
    }
    return (
      <Table columns={columns} dataSource={this.state.data} pagination={false} />
    )
  }
}