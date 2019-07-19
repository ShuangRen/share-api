# Share API

## 快速开始

## 提供2种方式启动

### 1. 从 npm 安装

1. 下载 npm 包

```
npm i @shuangren/share-api
yarn add @shuangren/share-api
```

2. 新建 js 文件并引入

```
// index.js
const ApiDoc = require('@shuangren/share-api');
const doc = new ApiDoc();
doc.start();
```

3. 启动

```
node index.js
```

### 从 git 安装

1. clone 仓库

```
git clone https://github.com/ShuangRen/share-api.git
```
2. 安装依赖

```
npm install
yarn
```

3. 启动

```
node dist/server/start.js
```

## 扩展配置

1. npm 安装

```
// index.js
const ApiDoc = require('@shuangren/share-api');
const doc = new ApiDoc();
doc.config({
  port: '3001',
  password: 'abc123',
  dataPath: '/var/demo/data.config'
});
doc.start();
```

2. git clone 安装

直接修改 `dist/server/config` 文件里的配置


## 配置说明

`dataPath`  缓存接口配置列表的数据文件， 默认在`dist/server` 目录下

`password` 切换到内部访问时的密码，默认 `123456`

`port` 启动端口，默认 `8081`

`ipList` 运行直接内部访问的ip 列表，默认 `[]`
``

### 全量配置参考

```
doc.config({
  port: '3001',
  password: 'abc123',
  dataPath: '/var/demo/data.config'
  ipList:[
    '192.168.1.111',
    '21.221.1.111'
  ]
});
```
