var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  // devtool: 'cheap-module-source-map',
  entry: [
    './app/js/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.ProvidePlugin({
      $: 'jquery/dist/jquery.min.js',
      jQuery: 'jquery/dist/jquery.min.js',
      'window.jQuery': 'jquery/dist/jquery.min.js'
    })
  ]
};
