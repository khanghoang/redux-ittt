import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

let plugins = [
  babel(babelrc()),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  commonjs()
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
