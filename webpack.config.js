const path = require('path')
const webpack = require('webpack')
const FilemanagerPlugin = require('filemanager-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const WextManifestWebpackPlugin = require('wext-manifest-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const viewsPath = path.join(__dirname, 'views')
const sourcePath = path.join(__dirname, 'src')
const destPath = path.join(__dirname, 'extension')
const nodeEnv = process.env.NODE_ENV || 'development'
const targetBrowser = process.env.TARGET_BROWSER

const extensionReloaderPlugin =
  nodeEnv === 'development'
    ? new ExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: 'contentScript',
          background: 'background',
          extensionPage: ['popup', 'downloadBackup', 'restoreBackup', 'selectAddress'],
        },
      })
    : () => {
        this.apply = () => {}
      }

const getExtensionFileType = (browser) => {
  if (browser === 'opera') {
    return 'crx'
  }

  if (browser === 'firefox') {
    return 'xpi'
  }

  return 'zip'
}

module.exports = {
  devtool: false,
  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },
  mode: nodeEnv,
  entry: {
    manifest: path.join(sourcePath, 'manifest.json'),
    background: path.join(sourcePath, 'utils', 'background.ts'),
    contentScript: path.join(sourcePath, 'utils', 'contentScript.ts'),
    popup: path.join(sourcePath, 'app.tsx'),
    downloadBackup: path.join(sourcePath, 'downloadBackup.tsx'),
    restoreBackup: path.join(sourcePath, 'restoreBackup.tsx'),
    selectAddress: path.join(sourcePath, 'selectAddress.tsx'),
  },
  output: {
    path: path.join(destPath, targetBrowser),
    filename: 'js/[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'webextension-polyfill-ts': path.resolve(
        path.join(__dirname, 'node_modules', 'webextension-polyfill-ts')
      ),
    },
  },
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /manifest\.json$/,
        use: {
          loader: 'wext-manifest-loader',
          options: {
            usePackageJSONVersion: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new WextManifestWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin({ filename: false }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`
        ),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'popup.html'),
      inject: 'body',
      chunks: ['popup'],
      hash: true,
      filename: 'popup.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'download-backup.html'),
      inject: 'body',
      chunks: ['downloadBackup'],
      hash: true,
      filename: 'download-backup.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'restore-backup.html'),
      inject: 'body',
      chunks: ['restoreBackup'],
      hash: true,
      filename: 'restore-backup.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'select-address.html'),
      inject: 'body',
      chunks: ['selectAddress'],
      hash: true,
      filename: 'select-address.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/scripts', to: 'js' },
      ],
    }),
    extensionReloaderPlugin,
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new FilemanagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                format: 'zip',
                source: path.join(destPath, targetBrowser),
                destination: `${path.join(destPath, targetBrowser)}.${getExtensionFileType(
                  targetBrowser
                )}`,
                options: { zlib: { level: 6 } },
              },
            ],
          },
        },
      }),
    ],
  },
}
