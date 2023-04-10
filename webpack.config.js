const rawLoader = require('raw-loader');
module.exports = {
    module: {
      rules: [
        {
          test: /\.zip$/,
          use: 'raw-loader',
        },
      ],
    },
  };