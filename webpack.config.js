const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

console.log('webpack config ......')
console.log('path.resolve', path.resolve(__dirname, 'src/index.js'))
console.log('path.join', path.join(__dirname, 'src/index.js'))

module.exports = {
  mode: 'development',
  node: {
    fs: 'empty'
  },
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.mdx?$/,
        use: [
          'babel-loader',
          '@mdx-js/loader',
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Just Try It',
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       common: {
  //         name: 'common',
  //         chunks: 'all',
  //         minChunks: 2,
  //         minSize: 0,
  //       }
  //     }
  //   }
  // }
}