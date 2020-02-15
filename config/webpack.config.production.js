const path = require('path')
const { resolve } = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { srcRoot, buildDir, pageDir, staticDir, publicDir, distDir } = require('./paths');
const merge = require('webpack-merge');
const baseConf = require('./webpack.config.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const OS = require('os');
const production = merge(baseConf, {

  output: {
    path: resolve(__dirname, "../dist"),
    filename: "[name].[chunkhash:8].js",
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: srcRoot,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: OS.cpus.length - 1,
            }
          },
          'cache-loader',//使用cacheDirectory，可以缓存编译结果，避免多次重复编译；
          'babel-loader',
        ]
        //loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      }
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false,
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 10000,
      maxSize: 0,
      minChunks: 2,
      // maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },

  plugins: [
    // 定义为生产环境，编译 React 时压缩到最小
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    //   }
    // }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    // new webpack.optimize.OccurenceOrderPlugin(),

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     //supresses warnings, usually from module minification
    //     warnings: false
    //   }
    // }),

    //分析编译模块
    // new BundleAnalyzerPlugin(),
    // 分离CSS和JS文件
    // new ExtractTextPlugin('[name].[contenthash:8].css'),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true })
    }),

    // 提供公共代码
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: '[name].[chunkhash:8].js'
    // }),

    // // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    // new webpack.DefinePlugin({
    //   __DEV__: false
    // }),

    new webpack.optimize.ModuleConcatenationPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.12.0/umd/react.production.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'axios',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js',
    //       global:'axios'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.11.0/umd/react-dom.production.min.js',
    //       global:'ReactDOM'
    //     },
    //     {
    //       module: 'react-router',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/react-router/5.1.2/react-router.min.js',
    //       global:'ReactRouter'
    //     },
    //     {
    //       module: 'react-router-dom',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.1.2/react-router-dom.min.js',
    //       global:'ReactRouterDOM'
    //     },
    //     {
    //       module: 'xlsx',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.4/xlsx.min.js',
    //       global:'Xlsx'
    //     }
    //   ]
    // }),
    new CopyPlugin([
      { from: publicDir, to: distDir },
    ]),
  ]
})

module.exports = production;