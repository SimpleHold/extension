const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

/** @type {import('webpack-merge')} */
module.exports = merge(common, {
  mode: 'production',
  stats: {
    children: true,
  },
})
