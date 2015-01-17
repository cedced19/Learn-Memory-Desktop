# Learn-Memory

A Node-Webkit software to learn your lesson.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Instalation

1. [Download for Windows](https://raw.githubusercontent.com/cedced19/Learn-Memory-Desktop/master/dist/Learn-Memory.zip)
2. Extract
3. Execute `Learn-Memory.exe`

![Demo](demo.png)


## Developers

### API

There are a Rest API on `http://localhost:9999/api/`.

### Save

The save is located at the same place of `.rc` files


### To compile

1. Download a version of [node-webkit](https://github.com/nwjs/nw.js)
2. Move it in the folder `resources/node-webkit/OS NAME`
3. Do `npm install && cd app/ && npm install && cd ../`
4. Do either `grunt dist-linux` or `grunt dist-linux32` or `grunt dist-win` or `grunt dist-mac`