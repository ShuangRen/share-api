# Share API

![version](https://img.shields.io/npm/v/@shuangren/share-api.svg)
![license](https://img.shields.io/github/license/ShuangRen/share-api.svg)
![language](https://img.shields.io/github/languages/top/ShuangRen/share-api.svg)
![download](https://img.shields.io/npm/dw/@shuangren/share-api.svg)
![pr](https://img.shields.io/github/issues-pr-closed/ShuangRen/share-api.svg)

## 介绍

基于Swagger，Swagger open api 3.0 规范，通过配置Swagger JSON 生成API 文档。

[查看更新日志](/changelog.md)

## 功能与特性

更友好的界面

更直观的展示

支持 enum的展示

支持公开，私有 不同的展示

支持配置私有API文档 ip访问白名单

支持私有化搭建

![预览](./img.gif)

## 快速开始

> 提供2种方式启动

#### 从 npm 安装

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

#### 从 git 安装

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

#### npm 安装

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

#### git clone 安装

直接修改 `dist/server/config` 文件里的配置

## 配置说明

`dataPath`  缓存接口配置列表的数据文件， 默认在 `dist/server` 目录下

`password` 切换到内部访问时的密码，默认 `123456`

`port` 启动端口，默认 `8081`

`ipList` 运行直接内部访问的ip 列表，默认 `[]`
``

## 全量配置参考

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
