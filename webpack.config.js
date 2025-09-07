const path = require('path');

module.exports = {
  target: 'node',
  externals: {
    'swisseph': 'commonjs swisseph',
    'swisseph-v2': 'commonjs swisseph-v2'
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      os: false,
    },
  },
};
