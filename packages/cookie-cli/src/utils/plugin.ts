import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import ora from 'ora'

import { Plugin, PluginConfigJson } from './../types/index.js'

import { checkFileIfExists, mergePkgDependencies, readJson, writeJson } from './index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PKG_JSON = 'package.json'

const DEFAULT_CREATE_PATH = process.cwd()

/**
 * @description 读取对应插件的配置json文件
 * @description 每个json文件必须有3or4个字段：config、devDependencies、dependencies、checkFiles
 * @param {Plugin} plugin
 * @date 2022-10-16 18:01:03
 * @return {PluginConfigJson}
 */
function getPluginConfigJson(plugin: Plugin): PluginConfigJson {
  const configJsonPath = path.resolve(__dirname, `../configs/${plugin}/config.json`)
  return readJson(configJsonPath)
}

// 检查插件配置文件是否存在
function checkConfigFiles(plugin: Plugin, checkFiles: string[]) {
  // const configJson = getPluginConfigJson(plugin)
  const hasPkg = checkFileIfExists([PKG_JSON])
  const file = checkFileIfExists(checkFiles)
  if (!hasPkg) {
    console.log({ hasPkg })
    throw new Error(`${PKG_JSON} 文件不存在`)
  }
  if (file) {
    throw new Error(`${file} 已存在`)
  }
}

/**
 * @description 创建插件
 * @param {Plugin} plugin
 * @date 2022-10-16 18:11:15
 * @return {void}
 */
export function createPlugin(plugin: Plugin) {
  const spinner = ora().start()
  const {
    checkFiles = [],
    config,
    devDependencies,
    dependencies,
    output: { file }
  } = getPluginConfigJson(plugin)
  checkConfigFiles(plugin, checkFiles)

  const originPkgPath = path.resolve(DEFAULT_CREATE_PATH, './package.json')

  try {
    // 1. 先合并package.json
    mergePkgDependencies({
      dependencies: dependencies,
      isDev: false
    })
    const mergedData = mergePkgDependencies({
      dependencies: devDependencies,
      isDev: true
    })
    writeJson({
      writePath: originPkgPath,
      writeData: mergedData
    })

    // 2. 输出文件
    const createPath = path.resolve(DEFAULT_CREATE_PATH, file)
    writeJson({
      writePath: createPath,
      writeData: config
    })
    spinner.succeed(`创建 ${chalk.blue(file)} 文件成功`)
  } catch (e) {
    console.log({ e })
    throw new Error(e)
  }
}
