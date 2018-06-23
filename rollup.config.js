import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json');

let plugins = [
  babel(babelrc())
];

export default {
  input: 'src/index.js',
  plugins: plugins,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'redux-ittt',
    }
  ]
};
