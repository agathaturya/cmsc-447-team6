
//using this server to host files locally in the proj directory
var express = require('express');
var app = express();
express.static.mime.define({'application/javascript': ['js']});
app.use(express.static(__dirname + '/proj')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);
//https://localhost:8000/main.js

/*


var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: 'proj/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
*/
