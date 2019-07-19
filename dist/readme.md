# Share API

[点击此处查看中文README](/README_CN.md)

## Installation

## Provide 2 ways to start

### 1. Install from npm

1. Download npm Package

```
npm i @shuangren/share-api
yarn add @shuangren/share-api
```

2. create new js file and import

```
// index.js
const ApiDoc = require('share-doc');
const doc = new ApiDoc();
doc.start();
```

3. startup

```
node index.js
```

### Install from Git

1. clone  repository

```
git clone https://github.com/ShuangRen/share-api.git
```
2. install dependencies

```
npm install
yarn
```

3. startup

```
node dist/server/start.js
```

## Extended configuration

1. Install from npm

```
// index.js
const ApiDoc = require('share-doc');
const doc = new ApiDoc();
doc.config({
  port: '3001',
  password: 'abc123',
  dataPath: '/var/demo/data.config'
});
doc.start();
```

2. Install from Git 

Directly modify the configuration in the file `dist/server/config` 


## Configuration instructions

`dataPath`  Cache interface configuration list data file, Default in `dist/server` 

`password` Switch to password for internal access, Default is `123456`

`port` start port  Default is `8081`

`ipList` An ip list that runs direct internal access, Default is `[]`

## Full configuration reference

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
