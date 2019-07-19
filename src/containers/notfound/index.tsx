import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './index.less';

export default class NotFound extends React.Component {
  public componentDidMount() {
    document.body.style.background = '#fff';
  }
  public componentWillUnmount() {
    document.body.style.background = '#f5f5f5';
  }
  public render() {
    return (
      <div className="not-found">
        <div className="notfound-body">
          <img src={require('../../images/404.png')} alt="404" />
          <div className="info">抱歉！您访问页面失联啦~</div>
        </div>

        <Link to="/" className="link">
          <Button type="primary" style={{ width: 168 }} className="back-btn">返回首页</Button>
        </Link>
      </div>
    );
  }
}
