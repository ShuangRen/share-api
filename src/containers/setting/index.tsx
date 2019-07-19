import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button, Modal, Input, Form, Divider, message, Select } from 'antd';
import { ICommonStore } from '@/store/interface/common.interface';

interface Istate {
  visible?: boolean,
  nameValidate: string | undefined,
  nameHelp: string,
  titleValidate: string | undefined,
  titleHelp: string,
  urlValidate: string | undefined,
  urlHelp: string
}

enum ISOPEN {
  True = '允许',
  False = '不允许'
}


@inject('common')
@observer
export default class Setting extends React.Component<{ common: ICommonStore }, Istate> {
  public state = {
    visible: false,
    nameValidate: undefined,
    nameHelp: '',
    urlValidate: undefined,
    urlHelp: '',
    titleValidate: undefined,
    titleHelp: '',
  }

  public columns = [{
    title: '名称',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: '别名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: 'url',
    dataIndex: 'url',
    key: 'url',
  }, {
    title: '操作',
    key: 'action',
    render: (text: string, record: any, index: number) => (
      <span key={index}>
        <a href="javascript:;" onClick={this.handleUpdate.bind(this, record, index)}>编辑</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={this.handleDelete.bind(this, index)}>删除</a>
      </span>
    ),
  }];

  public handleUpdate = (record: any, index: number) => {
    this.props.common.swaggerApiConfigCurrent = {
      index: index,
      title: record.title,
      name: record.name,
      url: record.url,
      isOpen: record.isOpen
    }

    this.setState({
      visible: true
    })
  }

  public handleDelete = (index: number) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确认删除',
      okType: 'danger',
      onOk: () => {
        this.updateDelete(index);
      }
    });
  }

  public updateDelete = async (index: number) => {
    const common = this.props.common;
    common.swaggerApiConfig.splice(index, 1);
    common.swaggerApiConfig = [...common.swaggerApiConfig];

    const result = await common.updateSwaggerApiConfig();

    if (result) {
      message.success('删除成功');
      window.location.href = '/'
    }
  }
  public handleClickModalVisiable = (num?: number) => {
    this.setState({
      visible: true
    })
    if (!num || num !== 0) {
      this.props.common.swaggerApiConfigCurrent = {
        index: this.props.common.swaggerApiConfig.length,
        title: '',
        name: '',
        url: '',
        isOpen: false
      }
    }
  }

  public handleOk = async () => {

    const common = this.props.common;
    if (!common.swaggerApiConfigCurrent) {
      return;
    }

    const state: Istate = {
      nameValidate: undefined,
      nameHelp: '',
      urlValidate: undefined,
      urlHelp: '',
      titleValidate: undefined,
      titleHelp: '',
    }
    let check = true;
    if (!common.swaggerApiConfigCurrent.title) {
      state['titleValidate'] = 'error';
      state['titleHelp'] = '不能为空';
      check = false;
    }

    if (!common.swaggerApiConfigCurrent.name || !/^([A-Z]|[a-z]|\-|[0-9])+$/g.test(common.swaggerApiConfigCurrent.name)) {
      state['nameValidate'] = 'error';
      state['nameHelp'] = '不能为空且为字母下划线组合如：foundation-data-center';
      check = false;
    }

    if (!common.swaggerApiConfigCurrent.url || !/http/.test(common.swaggerApiConfigCurrent.url)) {
      state['urlValidate'] = 'error';
      state['urlHelp'] = '必须为一个http地址';
      check = false;
    }

    this.setState(state)


    if (!check) {
      return;
    }

    common.swaggerApiConfig[common.swaggerApiConfigCurrent.index] = {
      title: common.swaggerApiConfigCurrent.title,
      name: common.swaggerApiConfigCurrent.name,
      url: common.swaggerApiConfigCurrent.url,
      isOpen: common.swaggerApiConfigCurrent.isOpen,
    }

    const result = await common.updateSwaggerApiConfig();

    if (result) {
      this.handleClickClose();
      common.swaggerApiConfigCurrent = null;
      window.location.href = '/setting'
    }
  }

  public handleClickClose = () => {
    this.setState({
      visible: false,
      nameValidate: undefined,
      nameHelp: '',
      urlValidate: undefined,
      urlHelp: '',
      titleValidate: undefined,
      titleHelp: '',
    })
  }

  public handleChangeInput = (name: string, ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.props.common.swaggerApiConfigCurrent) {
      console.log(213213123)
      return;
    }
    this.props.common.swaggerApiConfigCurrent[name] = ev.target.value
  }

  public handleChangeSelect = (name: string, value: string) => {
    if (!this.props.common.swaggerApiConfigCurrent) {
      console.log(213213123)
      return;
    }
    this.props.common.swaggerApiConfigCurrent[name] = value === ISOPEN.True ? true : false
  }


  public render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <div className="page-setting-container">
        <Button type="primary" onClick={this.handleClickModalVisiable.bind(this, 0)}>添加</Button>
        <br />
        <br />
        <Table columns={this.columns} dataSource={this.props.common.swaggerApiConfig} rowKey="title" pagination={false} />


        {
          this.props.common.swaggerApiConfigCurrent && (
            <Modal
              title="配置"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleClickClose}
            >
              <Form.Item
                label="名称" {...formItemLayout}
                validateStatus={this.state.titleValidate}
                help={this.state.titleHelp}>
                <Input placeholder="输入中文名称或描述"
                  value={this.props.common.swaggerApiConfigCurrent.title}
                  onChange={this.handleChangeInput.bind(this, 'title')} />
              </Form.Item>
              <Form.Item
                label="别名" {...formItemLayout}
                validateStatus={this.state.nameValidate}
                help={this.state.nameHelp}>
                <Input placeholder="输入别名 如：foundation-data-center"
                  value={this.props.common.swaggerApiConfigCurrent.name}
                  onChange={this.handleChangeInput.bind(this, 'name')} />
              </Form.Item>
              <Form.Item
                label="地址" {...formItemLayout}
                validateStatus={this.state.urlValidate}
                help={this.state.urlHelp}>
                <Input placeholder="输入swagger.json地址"
                  value={this.props.common.swaggerApiConfigCurrent.url}
                  onChange={this.handleChangeInput.bind(this, 'url')} />
              </Form.Item>
              <Form.Item
                label="允许外部访问" {...formItemLayout}>
                <Select value={this.props.common.swaggerApiConfigCurrent.isOpen ? ISOPEN.True : ISOPEN.False} onChange={this.handleChangeSelect.bind(this, 'isOpen')}>
                  <Select.Option value={ISOPEN.True}>允许</Select.Option>
                  <Select.Option value={ISOPEN.False}>不允许</Select.Option>
                </Select>
              </Form.Item>
            </Modal>
          )
        }

      </div>
    )
  }
}