import * as React from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import Parameter from './parameter';
import CodeTable from './codetable';
import { List, Tag } from 'antd';
import './right.less';
@inject('common')
@observer
export default class RightCode extends React.Component<any> {
  public renderParamters = (params: any) => {
    console.log(params);
    let param = {};
    params.forEach((v: any): any => {
      if (v.schema && v.schema.type) {
        if (v.schema.type === 'array') {
          console.log(v);
          if (v.schema.items && v.schema.items['$ref']) {
            let returnArray = false;
            if (this.props.method.toLocaleLowerCase() === 'get' || this.props.method.toLocaleLowerCase() === 'delete') {
              returnArray = true;
            }
            param = [this.renderResponse(v.schema.items['$ref'], 1, returnArray)];
          } else {
            param[v.name] = this.formatType(v.schema);
          }
        }
      } else if (v.schema && v.schema['$ref']) {
        let returnArray = false;
        if (this.props.method.toLocaleLowerCase() === 'get' || this.props.method.toLocaleLowerCase() === 'delete') {
          returnArray = true;
        }
        param = this.renderResponse(v.schema['$ref'], 1, returnArray);
      } else if (v.items && v.items['$ref']) {
        let returnArray = false;
        if (this.props.method.toLocaleLowerCase() === 'get' || this.props.method.toLocaleLowerCase() === 'delete') {
          returnArray = true;
        }
        param = [this.renderResponse(v.items['$ref'], 1, returnArray)];
      } else {
        if (v.in === 'path') {
          return false;
        }

        if (this.props.method.toLocaleLowerCase() === 'get' || this.props.method.toLocaleLowerCase() === 'delete') {
          console.log(v)
          param[v.name] = {
            value: v.type,
            required: v.required ? '必填' : '',
            format: v.format,
            description: v.description,
            enum: v.enum
          };
        } else {
          // 如果是 querystring 后面会单独处理
          if (v.in === 'query') {
            return false;
          }
          param[v.name] = this.formatType(v);
        }
      }
    })
    console.log(param);
    return param;
  }

  public renderQueryString = (params: any): any => {
    if (!params) {
      return null;
    }
    const param = {};
    params.forEach((v: any): any => {
      if (v.in === 'query') {
        const item = this.formatType(v, true);

        param[v.name] = item;
      }
    });

    return param;
  }

  public renderResponse = (res: any, num: number, returnArray?: boolean): any => {
    num++;
    // 模型名称
    const modelName = this.getDefinitions(res);
    // 模型
    const model = this.props.data.definitions[modelName];

    if (!model) {
      return null;
    }
    console.log(model);
    // 如果模型type 是 object
    // let result: any = null;;
    if (model.type === 'object') {
      // 如果有code data 和 resultMessage
      if (model.properties && model.properties.code && model.properties.data && model.properties.resultMessage) {
        const data = model.properties.data;
        // 如果data 有 type 并且是个boolean
        if (data.type === false || data.type === true) {
          return this.formatType(data, returnArray);
        }
        // 如果data有 $ref 属性
        if (data['$ref']) {
          return this.renderResponse(data['$ref'], num);
        }
        // 如果data 有 type  和 items 属性
        if (data.type && data.type === 'array') {
          return this.renderDataTypeArray(data.items, num, returnArray);
        }

        if (data.type) {
          return this.formatType(data, returnArray);
        }

        return this.renderResult(model, num, returnArray);
      }

      return this.renderResult(model, num, returnArray);
    }

  }

  public renderDataTypeArray = (data: any, num: number, returnArray?: boolean): any => {
    if (data) {

      if (data['$ref']) {
        return [this.renderResponse(data['$ref'], num, returnArray)];
      }
      if (data.type === 'array') {
        return this.renderDataTypeArray(data.items, num, returnArray);
      }
      return [this.formatType(data, returnArray)];
    }
  }

  public renderResult = (model: any, num: number, returnArray?: boolean) => {
    if (num > 6) {
      return '递归过多的内容不展示';
    }
    const result = {};
    for (const item in model.properties) {
      if (model.properties[item]['$ref']) {
        // result[item] = 'todo';
        result[item] = this.renderResponse(model.properties[item]['$ref'], num, returnArray);
      } else if (model.properties[item].additionalProperties) {
        if (model.properties[item].type === 'object') {
          result[item] = { [model.properties[item].description || '枚举或者随机key值']: this.renderParamters([model.properties[item].additionalProperties]) };
        } else {
          result[item] = this.renderParamters([model.properties[item].additionalProperties]);
        }
      } else if (model.properties[item].properties) {
        result[item] = this.renderResult(model.properties[item], num, returnArray);
      } else {
        const field = model.properties[item];
        if (field.in === 'path') {
          return false;
        }
        if (field.type === 'array') {
          result[item] = this.renderDataTypeArray(field, num, returnArray);
        } else {
          result[item] = this.formatType(field, returnArray);
          console.log(result[item]);
        }
      }
    }
    console.log(result)
    return result;
  }

  public formatType = (data: any, returnArray?: boolean): any => {
    console.log(data);
    let str = '';
    if (data.format) {
      str += ` <${data.format}>`;
    }

    if (data.enum) {
      str += ` (enum: ${data.enum.join(' | ')})`
    }

    if (data.required) {
      str += ` * 必填 * `
    }

    if (data.description) {
      str += `  // ${data.description}`;
    }
    switch (data.type) {
      case 'boolean':
        if (returnArray) {
          return {
            value: true,
            // format: data.format,
            // description: data.description,
            // required: data.required ? '必填' : ''
          }
        }
        return true
      case 'array':
        if (data.items) {
          return [this.formatType(data.items, returnArray)];
        }
        if (returnArray) {
          return {
            value: 'array',
            format: data.format,
            description: data.description,
            required: data.required ? '必填' : '',
            enum: data.enum
          }
        }
        return 'array' + str;
      default:
        if (returnArray) {
          return {
            value: data.type,
            format: data.format,
            description: data.description,
            required: data.required ? '必填' : '',
            enum: data.enum
          }
        }
        return data.type + str;
    }
  }

  public formatResult = (item: any) => {
    console.log(item)
    // 模型名称
    const modelName = this.getDefinitions(item.value);

    const result = {
      code: 200,
      data: item.isArray ? [this.renderResponse(item.value, 1)] : this.renderResponse(item.value, 1),
      resultMessage: 'string'
    };
    if (/PageListResponse/.test(modelName)) {
      result['page'] = 0;
      result['pageSize'] = 0;
      result['totalCount'] = 0;
    }
    return JSON.stringify(result, null, 2);
  }

  public getDefinitions = (str: string) => {
    if (/\#\/definitions\//.test(str)) {
      return str.replace(/\#\/definitions\/(.*)/, '$1');
    }
    return '';
  }

  public renderListItem = (item: any) => {
    return <List.Item><span>{item.name}</span><em> : </em><code>{item.value}</code></List.Item>
  }

  public renderRequest = (item: any, resultParamters: any) => {
    if (this.props.method.toLocaleLowerCase() === 'get' || this.props.method.toLocaleLowerCase() === 'delete') {
      if (item.parameters && Object.keys(resultParamters).length > 0) {
        return (
          <Parameter items={this.renderParamters(item.parameters)} />
        )
      }
      return 'No Parameters'
    }

    if (item.parameters && resultParamters && Object.keys(resultParamters).length > 0) {
      return (
        <pre className="response-pre">
          {JSON.stringify(this.renderParamters(item.parameters), null, 2)}
        </pre>
      )
    }

    return 'No Parameters';
  }
  public render() {
    if (!this.props.item) {
      return null;
    }

    const item = this.props.item;
    const listData = [
      {
        name: '地址',
        value: this.props.url
      }, {
        name: '基础路径',
        value: this.props.base
      }, {
        name: 'Method',
        value: this.props.method.toLocaleUpperCase()
      }
    ]

    const renderParamters = (parameters: any) => {
      return this.renderParamters(parameters);
    }
    const resultParamters = item.parameters ? renderParamters(item.parameters) : false;

    const codeBoxClassName = classnames('code-box', { deprecated: item.deprecated });

    const queryString = this.renderQueryString(item.parameters) || {};

    return (
      <div className={codeBoxClassName}>
        <h3>{item.summary}&nbsp;&nbsp;{item.deprecated && <Tag color="red">已弃用</Tag>}</h3>
        <List
          bordered={true}
          dataSource={listData}
          renderItem={this.renderListItem}
          className="list-item"
        />
        {
          Object.keys(queryString).length > 0 && this.props.method.toLocaleLowerCase() !== 'get' && (
            <>
              <h4>QueryString</h4>
              <Parameter items={queryString} />
            </>
          )
        }
        <h4>请求参数（Request）</h4>
        {
          this.renderRequest(item, resultParamters)
        }
        <h4>错误码说明</h4>
        {
          <CodeTable items={item.responses} />
        }
        <h4>返回参数（Response）</h4>
        {
          <pre className="response-pre">
            {this.resSchema(item)}
          </pre>
        }
      </div>
    )
  }

  private resSchema = (item: any) => {
    if (!item.responses[200]) {
      return 'No Responses';
    }
    if (!item.responses[200].schema) {
      return 'No Responses';
    }
    if (item.responses[200].schema['$ref']) {
      const result = {
        value: item.responses[200].schema['$ref'],
        isArray: false
      }

      return this.formatResult(result);
    }

    if (item.responses[200].schema['items']) {
      const result = {
        value: item.responses[200].schema.items['$ref'],
        isArray: true
      }
      return this.formatResult(result);
    }

    if (item.responses[200].schema.properties) {
      console.log(item.responses[200].schema.properties);
      const result = {
        code: 200,
        data: this.renderResult(item.responses[200].schema, 1),
        resultMessage: 'string'
      };

      return JSON.stringify(result, null, 2);
    }

    return 'No Responses';
  }
}