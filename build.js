var NwBuilder = require('node-webkit-builder');

var nw = new NwBuilder({
    files: './app/**/**',
    platforms:  ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']
});


nw.on('log',  console.log);

nw.build().then(function () {
    console.log('Build done!');
}).catch(function (error) {
    console.error(error);
});