import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import ora from 'ora'

import { checkFileIfExists, readJson, writeJson, mergePkgDependencies } from '../../utils/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const checkFiles = [
  '.prettierrc.json',
  '.prettierrc',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.json5'
]

const prettierConfig = {
  tabWidth: 2,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  useTabs: true
}

export const createPrettier = async () => {
  const file = checkFileIfExists(checkFiles)
  const spinner = ora()
  if (file) {
    spinner.fail(
      `The file ${chalk.red(
        file
      )} has already existed, please delete it and create the plugin again!`
    )
    process.exit(1)
  }
  const templateJsonPath = path.resolve(__dirname, './template.json')
  const originPkgPath = path.resolve(process.cwd(), './package.json')
  // 1. 先合并packge.json
  const templateJson = readJson(templateJsonPath)
  const devDependencies = templateJson.devDependencies
  const mergedPkg = mergePkgDependencies(templateJson.devDependencies)
  writeJson(originPkgPath, mergedPkg)

  // 2. 再输出文件
  const createPath = path.resolve(process.cwd(), '.prettierrc')
  writeJson(createPath, prettierConfig)
  spinner.succeed(`package.json 增加如下依赖${chalk.blue(JSON.stringify(devDependencies))}`)
}
