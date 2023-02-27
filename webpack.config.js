const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (options) => {
  const isProduction = !!Object.prototype.hasOwnProperty.call(options,'production');

  const createHash = (ext) => `[name].[contenthash].${ext}`

  const createAssetPath = (pathData) => {
    const filepath = path
      .dirname(pathData.filename)
      .split('/')
      .slice(1)
      .join('/');
    return `assets/${filepath}/[name][ext]`;
  }

  return {
    mode: isProduction ? 'production' : 'development',
    context: path.resolve(__dirname, 'src'),
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
      clean: true,
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? createHash('js') : '[name].js',
      assetModuleFilename: (pathData) => createAssetPath(pathData),
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devtool: isProduction ? 'nosources-source-map' : 'source-map',
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 3003,
      historyApiFallback: true
    },
    plugins: [
      new ESLintPlugin({ extensions: ['ts', 'js'] }),
      new MiniCssExtractPlugin({ filename: createHash('css') }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        filename: 'index.html',
        favicon: path.resolve(__dirname, './src/assets/icons/favicon.svg'),
        inject: 'body'
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, './src/public'),
          to: path.resolve(__dirname, './dist') },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.(ts|tsx)$/i,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
          type: isProduction ? 'asset/resource' : 'asset/inline'
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
      ],
    },
  }
};
