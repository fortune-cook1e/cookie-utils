/* eslint-disable no-restricted-globals */
import path from 'node:path'

// import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

import pkg from './package.json'

// import type { Plugin, RollupOptions } from 'rollup'

function createNodeConfig(isProduction) {
  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false
    },
    input: {
      index: path.resolve(__dirname, 'src/index.ts')
    },
    output: {
      dir: path.resolve(__dirname, 'dist'),
      // entryFileNames: `node/[name].js`,
      // chunkFileNames: 'node/chunks/dep-[hash].js',
      exports: 'named',
      format: 'esm',
      externalLiveBindings: false,
      freeze: false,
      sourcemap: !isProduction
    },
    external: [
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies))
    ],
    onwarn(warning, warn) {
      // node-resolve complains a lot about this but seems to still work?
      if (warning.message.includes('Package subpath')) {
        return
      }
      // we use the eval('require') trick to deal with optional deps
      if (warning.message.includes('Use of eval')) {
        return
      }
      if (warning.message.includes('Circular dependency')) {
        return
      }
      warn(warning)
    },
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      typescript({
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        sourceMap: false,
        declaration: false
        // declarationDir: declarationDir !== false ? declarationDir : undefined
      }),

      json()
    ]
  })
}

export default commandLineArgs => {
  return defineConfig([createNodeConfig(false)])
}
