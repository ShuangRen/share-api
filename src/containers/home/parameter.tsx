import * as React from 'react';
import { Table, Popover } from 'antd';

const columns = [{
  title: '字段名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '类型',
  dataIndex: 'value',
  key: 'value',
}, {
  title: '格式',
  dataIndex: 'format',
  key: 'format',
  render: (text: string, record: any) => {
    console.log(record)
    if (record.enum) {
      return <Popover content={<div dangerouslySetInnerHTML={{ '__html': record.enum.join('<br/>') }} />} title="enum" style={{ maxWidth: 300, wordBreak: 'break-all' }}><span>enum</span></Popover>
    }

    return <span>{text}</span>
  },
}, {
  title: '说明',
  dataIndex: 'description',
  key: 'description',
},
{
  title: '必填',
  dataIndex: 'required',
  key: 'required',
}]

export default class Parameter extends React.Component<any, any> {
  public state = {
    data: []
  }
  public componentDidMount() {
    this.mappingState();
    console.log(this.state.data);
  }
  public mappingState = () => {
    const data: any[] = [];
    Object.keys(this.props.items).forEach((v: any) => {
      data.push({
        name: v,
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