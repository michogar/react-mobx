const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')

const plugins = [
  new ExtractTextPlugin('css/styles.css'),
  new DotenvPlugin({
    path: '.test.env'
  })
]

let webpackConf = {
  context: path.resolve(__dirname),
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.html', '.styl']
  },
  devtool: 'inline-source-map',
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react-test-renderer/shallow': true,
    'react/lib/ReactContext': true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=[name].[ext]&outputPath=assets/&publicPath=../'
      }
    ]
  },
  plugins: plugins
}

const testFiles = 'webpack.tests.js'
let preProcessors = {}

preProcessors[testFiles] = ['webpack', 'sourcemap'] // preprocess with webpack and our sourcemap loader

module.exports = function (config) {
  config.set({
    browsers: process.env.TRAVIS ? ['PhantomJS'] : ['Chrome'],
    frameworks: ['jasmine'], // use the jasmine test framework
    files: [
      {pattern: './src/map/resources/**/*', served: true, included: false},
      testFiles
    ],
    preprocessors: preProcessors,
    reporters: ['mocha'], // report results in this format
    webpack: webpackConf,
    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
    },
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.TRAVIS,
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}