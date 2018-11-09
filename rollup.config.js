import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

let pkg = require('./package.json');

let plugins = [
  babel(babelrc()),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  commonjs(),
  uglify({
    sourcemap: true
  })
];

export default {
  input: 'src/index.js',
  plugins: plugins,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'redux-ittt',
      sourcemap: true,
      sourcemapFile: "index.js.map"
    }
  ]
};
