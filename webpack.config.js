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
          inpage: 'inpage',
          trezor: 'trezor',
          extensionPage: [
            'popup',
            'downloadBackup',
            'restoreBackup',
            'selectAddress',
            'send',
            'sendConfirmation',
          ],
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

const config = {
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
    background: path.join(sourcePath, 'utils', 'browser', 'background.ts'),
    contentScript: path.join(sourcePath, 'utils', 'browser', 'contentScript.ts'),
    inpage: path.join(sourcePath, 'utils', 'browser', 'inpage.ts'),
    trezor: path.join(sourcePath, 'utils', 'trezor', 'trezor-content-script.ts'),
    popup: path.join(sourcePath, 'app.tsx'),
    downloadBackup: path.join(sourcePath, 'externalPages/DownloadBackup/DownloadBackup.tsx'),
    restoreBackup: path.join(sourcePath, 'externalPages/RestoreBackup/RestoreBackup.tsx'),
    selectAddress: path.join(sourcePath, 'externalPages/SelectAddress/SelectAddress.tsx'),
    send: path.join(sourcePath, 'externalPages/Send/Send.tsx'),
    sendConfirmation: path.join(sourcePath, 'externalPages/SendConfirmation/SendConfirmation.tsx'),
    connectTrezor: path.join(sourcePath, 'externalPages/ConnectTrezor/ConnectTrezor.tsx'),
    connectLedger: path.join(sourcePath, 'externalPages/connectLedger/connectLedger.tsx'),
    phishing: path.join(sourcePath, 'externalPages/Phishing/Phishing.tsx'),
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
      template: path.join(viewsPath, 'phishing.html'),
      inject: 'body',
      chunks: ['phishing'],
      hash: true,
      filename: 'phishing.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'select-address.html'),
      inject: 'body',
      chunks: ['selectAddress'],
      hash: false,
      filename: 'select-address.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'send.html'),
      inject: 'body',
      chunks: ['send'],
      hash: true,
      filename: 'send.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'send-confirmation.html'),
      inject: 'body',
      chunks: ['sendConfirmation'],
      hash: true,
      filename: 'send-confirmation.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'connect-trezor.html'),
      inject: 'body',
      chunks: ['connectTrezor'],
      hash: true,
      filename: 'connect-trezor.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'connect-ledger.html'),
      inject: 'body',
      chunks: ['connectLedger'],
      hash: true,
      filename: 'connect-ledger.html',
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

if (nodeEnv === 'production') {
  config.optimization.splitChunks = {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  }
}

module.exports = config
