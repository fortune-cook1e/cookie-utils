import path from 'node:path'

import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  external: [...Object.keys(pkg.devDependencies)],
  // external: id => !/^[./]/.test(id),
  output: [
    {
      file: `./dist/index.js`,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [commonJs(), typescript(), nodeResolve({ preferBuiltins: true }), json(), terser()]
}
