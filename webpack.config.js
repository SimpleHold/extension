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

const extensionReloaderPlugin = new ExtensionReloader({
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

const getExtensionFileType = (browser) => {
  if (browser === 'opera') {
    return 'crx'
  }

  if (browser === 'firefox') {
    return 'xpi'
  }

  return 'zip'
}

const externalPages = [
  {
    filename: 'popup.html',
    chunks: ['popup'],
  },
  {
    filename: 'download-backup.html',
    chunks: ['downloadBackup'],
  },
  {
    filename: 'restore-backup.html',
    chunks: ['restoreBackup'],
  },
  {
    filename: 'phishing.html',
    chunks: ['phishing'],
  },
  {
    chunks: ['selectAddress'],
    filename: 'select-address.html',
  },
  {
    chunks: ['send'],
    filename: 'send.html',
  },
  {
    chunks: ['sendConfirmation'],
    filename: 'send-confirmation.html',
  },
  {
    chunks: ['connectTrezor'],
    filename: 'connect-trezor.html',
  },
  {
    chunks: ['connectLedger'],
    filename: 'connect-ledger.html',
  },
  {
    chunks: [],
    filename: 'trezor-usb-permissions.html',
  },
]

const multipleHtmlPlugins = externalPages.map((page) => {
  const { filename, chunks } = page

  return new HtmlWebpackPlugin({
    template: path.join(viewsPath, filename),
    inject: 'body',
    chunks,
    hash: true,
    filename,
  })
})

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
    trezorUsbPermissions: path.join(sourcePath, 'utils', 'trezor', 'trezor-usb-permissions.ts'),
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
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/scripts', to: 'js' },
      ],
    }),
  ].concat(multipleHtmlPlugins),
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
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]((?!(@emurgo)).*)[\\/]/,
          name: 'vendor',
          maxSize: 3500 * 1000,
          chunks(chunk) {
            return (
              !(chunk.name === 'background' && targetBrowser !== 'firefox') &&
              chunk.name !== 'contentScript' &&
              chunk.name !== 'trezor' &&
              chunk.name !== 'inpage' &&
              chunk.name !== 'trezorUsbPermissions'
            )
          },
        },
      },
    },
  },
}

if (nodeEnv === 'development') {
  config.plugins.push(extensionReloaderPlugin)
}

module.exports = config
