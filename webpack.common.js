const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    filename: 'select-address.html',
    chunks: ['selectAddress'],
  },
  {
    filename: 'send.html',
    chunks: ['send'],
  },
  {
    filename: 'send-confirm.html',
    chunks: ['sendConfirm'],
  },
  {
    filename: 'connect-trezor.html',
    chunks: ['connectTrezor'],
  },
  {
    filename: 'connect-ledger.html',
    chunks: ['connectLedger'],
  },
  {
    filename: 'trezor-usb-permissions.html',
    chunks: [],
  },
]

const multipleHtmlPlugins = externalPages.map((page) => {
  const { filename, chunks } = page

  return new HtmlWebpackPlugin({
    template: path.join('views', filename),
    inject: 'body',
    chunks,
    hash: true,
    filename,
  })
})

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    background: path.join(__dirname, 'src/utils/browser/background.ts'),
    contentScript: path.join(__dirname, 'src/utils/browser/contentScript.ts'),
    inpage: path.join(__dirname, 'src/utils/browser/inpage.ts'),
    popup: path.join(__dirname, 'src/popup/index.tsx'),

    // External pages
    downloadBackup: path.join(__dirname, 'src/externalPages/DownloadBackup/DownloadBackup.tsx'),
    selectAddress: path.join(__dirname, 'src/externalPages/SelectAddress/SelectAddress.tsx'),
    connectLedger: path.join(__dirname, 'src/externalPages/ConnectLedger/ConnectLedger.tsx'),
    connectTrezor: path.join(__dirname, 'src/externalPages/ConnectTrezor/ConnectTrezor.tsx'),
    phishing: path.join(__dirname, 'src/externalPages/Phishing/Phishing.tsx'),
    restoreBackup: path.join(__dirname, 'src/externalPages/RestoreBackup/RestoreBackup.tsx'),
    send: path.join(__dirname, 'src/externalPages/Send/Send.tsx'),
    sendConfirm: path.join(__dirname, 'src/externalPages/SendConfirm/SendConfirm.tsx'),

    // Other
    trezorUsbPermissions: path.join(__dirname, 'src/utils/trezor/trezor-usb-permissions.ts'),
    trezor: path.join(__dirname, 'src/utils/trezor/trezor-content-script.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '../static/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      assert: ['assert', 'Assert'],
      process: 'process/browser',
    }),
    new Dotenv(),
  ].concat(multipleHtmlPlugins),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@drawers': path.resolve(__dirname, 'src/drawers'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@coins': path.resolve(__dirname, 'src/coins'),
      '@tokens': path.resolve(__dirname, 'src/tokens'),
      '@store': path.resolve(__dirname, 'src/store'),
      process: 'process/browser',
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert'),
      url: false,
      util: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      process: false,
      path: false,
      fs: false,
      os: false,
      https: require.resolve('agent-base'),
      http: false,
      querystring: false,
    },
  },
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
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          maxSize: 3500 * 1000,
          chunks(chunk) {
            const chunkNames = [
              'background',
              'contentScript',
              'trezor',
              'inpage',
              'trezorUsbPermissions',
            ]

            return chunkNames.indexOf(chunk.name) === -1
          },
        },
      },
    },
  },
}
