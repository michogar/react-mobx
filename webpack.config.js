const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const webpack = require('webpack')

const entries = [
  'react-hot-loader/patch',
  // activate HMR for React

  './src/index.js'
  // the entry point of our app
]

const plugins = [
  new ExtractTextPlugin('css/[name].css'),
  new DotenvPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor', // Specify the common bundle's name.
    minChunks: (module) => {
      return module.context && module.context.includes('node_modules') && !module.context.includes('node_modules/webpack')
    }
  }),
  new webpack.HotModuleReplacementPlugin(), // Enable HMR
  new webpack.NamedModulesPlugin()
]

let outputPath = 'dist/'

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname),
  entry: {
    main: entries
  },
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: 'js/[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.html', '.jpg']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      },
      {
        test: /\.(jpg|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=[name].[ext]&outputPath=assets/&publicPath=../'
      }
    ]
  },
  devServer: {
    contentBase: outputPath,
    historyApiFallback: true,
    host: '0.0.0.0',
    stats: 'minimal',
    hot: true,
    https: true,
    disableHostCheck: true,
    compress: true
  },
  plugins: plugins
}