const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpacklugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

const IS_DEV = process.env.NODE_ENV = 'development'
const IS_PROD = !IS_DEV

const getFilename = (ext) => IS_DEV ? `[name].${ext}` : `[name].[fullhash].${ext}`

const setPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon_atom.png'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: getFilename('css')
    }),
    new EslintWebpackPlugin({
      extensions: ['js'],
      fix: true
    })
  ]

  if(IS_DEV) {
  }
  if(IS_PROD) {
  }

  return plugins
}

const cssLoaders = (extra) => {
  const loaders =
    [
      MiniCssExtractPlugin.loader, 'css-loader'
    ]

  if(extra) {
    loaders.push(extra)
  }

  return loaders
}

const jsLoaders = (extra) => {
  const loaders = {
    loader: "babel-loader",
    options: {
      presets: ['@babel/preset-env']
    }
  }

  if(extra) {
    loaders.options.presets.push(extra)
  }

  return loaders
}

const optimize = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new CssMinimizerWebpacklugin(),
      new TerserWebpackPlugin
    ]
  }

  if(IS_DEV) {
  }
  if(IS_PROD) {
  }

  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './index.jsx',
    stat: './statistics.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: getFilename('js')
  },
  target: "web",
  devServer: {
    hot: false,
    port: 4200
  },
  devtool: IS_DEV ? 'source-map' : false,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.rxjs', '.jsx', 'tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  optimization: optimize(),
  plugins: setPlugins(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-react')
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript')
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|jpeg|webp|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash][ext]',
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        }
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      }
    ]
  }
};