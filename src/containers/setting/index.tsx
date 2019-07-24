import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button, Modal, Input, Form, Divider, message, Select } from 'antd';
import { ICommonStore, ICenterConfig } from '@/store/interface/common.interface';
import { FormComponentProps } from 'antd/lib/form';

export interface ISwaggerApiConfigCurrent extends ICenterConfig {
  index: number
}

interface IState {
  visible?: boolean,
  currentIndex: number
}

enum ISOPEN {
  True = '允许',
  False = '不允许'
}

interface IProps extends FormComponentProps {
  common: ICommonStore
}


@inject('common')
@observer
class Setting extends React.Component<IProps, IState> {
  public state: IState = {
    visible: false,
    currentIndex: -1
  }

  private columns = [
    {
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
    }
  ];

  public handleUpdate = (record: any, index: number) => {
    this.setState({
      currentIndex: index,
      visible: true
    }, () => {
      this.props.form.setFields({
        title: {
          value: record.title
        },
        name: {
          value: record.name
        },
        url: {
          value: record.url
        },
        isOpen: {
          value: record.isOpen === true ? ISOPEN.True : ISOPEN.False
        }
      })
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
      this.setState({
        currentIndex: this.props.common.swaggerApiConfig.length,
      })
    }
  }

  public handleOk = async () => {

    const common = this.props.common;

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      if (this.state.currentIndex === -1) {
        return;
      }

      common.swaggerApiConfig[this.state.currentIndex] = {
        title: values.title,
        name: values.name,
        url: values.url,
        isOpen: values.isOpen === ISOPEN.True ? true : false,
      }

      const result = await common.updateSwaggerApiConfig();

      if (result) {
        this.handleClickClose();
        window.location.href = '/setting'
      }
    });
  }

  public handleClickClose = () => {
    this.setState({
      visible: false,
      currentIndex: -1
    })
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

    const { getFieldDecorator } = this.props.form;

    return (
      <div className="page-setting-container">
        <Button type="primary" onClick={this.handleClickModalVisiable.bind(this, 0)}>添加</Button>
        <br />
        <br />
        <Table columns={this.columns} dataSource={this.props.common.swaggerApiConfig} rowKey="title" pagination={false} />


        {
          this.state.currentIndex !== -1 && (
            <Modal
              title="配置"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleClickClose}
            >
              <Form>
                <Form.Item
                  label="名称" {...formItemLayout}>
                  {
                    getFieldDecorator('title', {
                      rules: [
                        {
                          required: true,
                          message: '名称或描述不能为空',
                        },
                      ],
                    })(
                      <Input placeholder="输入中文名称或描述" />
                    )
                  }
                </Form.Item>
                <Form.Item label="别名" {...formItemLayout}>
                  {
                    getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: '不能为空且为字母下划线组合如：aa-bb-cc',
                          pattern: /^([A-Z]|[a-z]|\-|[0-9])+$/g
                        },
                      ],
                    })(
                      <Input placeholder="输入别名 如：aa-bb-cc" />
                    )
                  }
                </Form.Item>
                <Form.Item
                  label="地址" {...formItemLayout}>
                  {
                    getFieldDecorator('url', {
                      rules: [
                        {
                          required: true,
                          message: '必须为一个http地址',
                          pattern: /http/
                        },
                      ],
                    })(
                      <Input placeholder="输入swagger.json地址" />
                    )
                  }
                </Form.Item>
                <Form.Item
                  label="允许外部访问" {...formItemLayout}>
                  {
                    getFieldDecorator('isOpen', {
                      initialValue: ISOPEN.True
                    })(
                      <Select>
                        <Select.Option value={ISOPEN.True}>允许</Select.Option>
                        <Select.Option value={ISOPEN.False}>不允许</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
              </Form>
            </Modal>
          )
        }

      </div>
    )
  }
}


export default Form.create()<IProps>(Setting);