import path from 'node:path'

import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
  output: [
    {
      file: `./dist/index.js`,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [nodeResolve({ preferBuiltins: true }), typescript(), json()]
}
