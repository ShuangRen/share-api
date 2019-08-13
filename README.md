# Share API
![node](https://img.shields.io/node/v/egg)
![platform](https://img.shields.io/powershellgallery/p/DNS.1.1.1.1)

![version](https://img.shields.io/github/package-json/v/ShuangRen/share-api)
![license](https://img.shields.io/github/license/ShuangRen/share-api.svg)
![language](https://img.shields.io/github/languages/top/ShuangRen/share-api.svg)
![download](https://img.shields.io/npm/dm/@shuangren/share-api.svg)
![pr](https://img.shields.io/github/issues-pr-closed/ShuangRen/share-api.svg)

[查看中文README](/README_CN.md)

## Introduction

Based on Swagger and Swagger Open API 2.0 Specification, a tool for generating API documentation by configuring Swagger JSON.


## Features

- More friendly UI
- More intuitive display
- Support for `enum` display
- Support for both public and private displays
- Support for configuring IP access whitelist for private API documentation 
- Support for privatization deployment

![预览](./img.gif)



## Version 1.1.0

1. **Support for secondary path**

* In some cases, you need to use `www.example.com/scopePath` to access, instead of directly accessing the domain name `www.example.com`
* Now `scopePath` is a configurable item

2. **Rewritten the `setting` related code, the form validation is completely taken over by antd**

3. **Added `enablePrivate` configuration, which is disabled by default. When enabled, it will enable the distinction between private and non-private interfaces.**

* Some switches do not require private configuration by switching on and off the switch that controls the private configuration.
* The previous design caused the use to be too complicated. If no IP whitelist is configured, you need to enter a password to access the configuration item.

[More Change Logs](/changelog.md)

## Quick Start

> Providing 2 ways to start

#### 1. Install from npm

1. Download npm Package

```
npm i @shuangren/share-api
yarn add @shuangren/share-api
```

2. Create new js file and import

```
// index.js
const ApiDoc = require('@shuangren/share-api');
const doc = new ApiDoc();
doc.start();
```

3. Startup

```
node index.js
```

#### Install from Git

1. Clone repository

```
git clone https://github.com/ShuangRen/share-api.git
```
2. Install dependencies

```
npm install
yarn
```

3. Startup

```
node dist/server/start.js
```

## Extended configuration

#### Install from npm

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

#### Install from Git 

Directly modify the configuration in the file `dist/server/config` 


## Configuration instructions

`dataPath`  data file that caches interface configuration list , Default `dist/server` 

`password` password when switched to internal access mode, Default is `123456`

`port` start port  Default is `8081`

`ipList` An IP list that runs direct internal access, Default is `[]`

`scopePath` After enabling, Access using  `www.example.com/scopePath`,  Default is `empty string`, showed `proxy-pass`, `shareapi-static` to node server

`enablePrivate` enable private config, Default is `false`

## Whole configuration reference

```
doc.config({
  port: '3001',
  password: 'abc123',
  dataPath: '/var/demo/data.config'
  ipList:[
    '192.168.1.111',
    '21.221.1.111'
  ],
  scopePath = 'abc',
  enablePrivate = true
});
```
