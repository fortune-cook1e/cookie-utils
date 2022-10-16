import childProcess from 'child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import spawn from 'cross-spawn'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import semver from 'semver'

import { deleteExistFileQuestion } from '../constants/questions.js'
import { AnyOptions } from '../types/index.js'

const execSync = childProcess.execSync
// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const checkCurrentNodeVersion = (wanted: string): void => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        'Your current Node version is ' +
          process.version +
          ', but the cli need' +
          wanted +
          'version.'
      )
    )
    process.exit(1)
  }
}

export const getPackageInfo = (): AnyOptions => {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json')) as any)
}

/**
 * @description 安装依赖包
 * @param {dependencies} 依赖
 * @param {isDev} 是否为开发依赖
 * @param {cwd} 安装路径
 * @date 2021-05-03 21:17:48
 */
export const installPackages = async ({
  dependencies = [],
  isDev = true,
  cwd = '',
  stdio = 'inherit'
}: {
  dependencies: string[]
  isDev: boolean
  cwd: string
  stdio?: 'inherit' | 'ignore'
}): Promise<void> => {
  if (dependencies.length === 0) return
  const { usePnpm, useYarn, useNpm, allPassed } = await checkPackageTools()
  if (!allPassed) {
    console.log(chalk.red('Please install npm or yarn'))
    process.exit(1)
  }

  // 检测是否存在package.json 文件
  const packagePath = path.join(cwd, 'package.json')
  if (!fs.existsSync(packagePath)) {
    console.log(chalk.yellow('creating package.json file..'))
    await packageInit(cwd)
  }

  try {
    let command
    let args
    if (usePnpm) {
      command = 'pnpm'
      args = 'add'
      dependencies.length > 0 && (args = ['add', '--exact'])
      isDev && (args as string[]).push('--dev')
    } else if (useYarn) {
      command = 'yarnpkg'
      // 这里区分两种情况，1. 无依赖 只需要执行 yarn install 2.有依赖区分是开发还是生产
      args = 'install'
      dependencies.length > 0 && (args = ['add', '--exact'])
      isDev && (args as string[]).push('--dev')
    } else {
      command = 'npm'
      args = ['install']
      isDev && (args as string[]).push('--save-dev')
    }

    dependencies.length > 0 && [].push.apply(args, dependencies as never[])
    const child = spawn.sync(command, args as any, { stdio, cwd })
    if (child.status !== 0) {
      console.log(chalk.red(`\`${command} ${(args as string[]).join(' ')}\` failed`))
    }
  } catch (e: any) {
    console.log(chalk.yellow(e.message || '安装依赖失败'))
    process.exit(1)
  }
}

/**
 * @description 删除包
 * @date 2021-05-04 11:07:36
 */
export const removePackages = async ({
  dependencies = [],
  cwd = '',
  stdio = 'inherit'
}: {
  dependencies: string[]
  cwd: string
  stdio?: 'inherit' | 'ignore'
}): Promise<void> => {
  if (dependencies.length === 0) return
  const { usePnpm, useYarn, useNpm, allPassed } = await checkPackageTools()
  if (!allPassed) {
    console.log(chalk.red('Please install pnpm or npm or yarn'))
    process.exit(1)
  }

  try {
    let command
    let args: string[] = ['remove']
    if (usePnpm) {
      command = 'pnpm'
      args = ['remove']
    } else if (useYarn) {
      command = 'yarnpkg'
      args = ['remove']
    } else {
      command = 'npm'
      args = ['uninstall']
    }
    ;[].push.apply(args, dependencies as never[])
    const child = spawn.sync(command, args, { stdio, cwd })
    if (child.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`)
    }
  } catch (e) {
    console.log()
  }
}

export const canUsePnpm = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      execSync('pnpm --version', { stdio: 'ignore' })
      resolve(true)
    } catch (e) {
      resolve(false)
    }
  })
}

export const canUseYarn = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      execSync('yarnpkg --version', { stdio: 'ignore' })
      resolve(true)
    } catch (e) {
      resolve(false)
    }
  })
}

export const canUseNpm = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      execSync('npm --version', { stdio: 'ignore' })
      resolve(true)
    } catch (e) {
      resolve(false)
    }
  })
}

/**
 * @description 检查是否能用yarn or npm or pnpm
 * @param {*} async
 * @date 2021-05-04 11:18:52
 * @see
 * @return {*}
 */
export const checkPackageTools = async (): Promise<{
  usePnpm: boolean
  useYarn: boolean
  useNpm: boolean
  allPassed: boolean
}> => {
  const [usePnpm, useYarn, useNpm] = await Promise.all([canUsePnpm(), canUseYarn(), canUseNpm()])
  const allPassed = usePnpm && useYarn && useNpm
  return {
    usePnpm,
    useYarn,
    useNpm,
    allPassed
  }
}

/**
 * @description 包初始化 执行命令为 npm init -y or yarn init -y
 * @param {cwd} 执行路径
 * @date 2021-05-04 22:10:27
 */
export const packageInit = async (cwd = ''): Promise<boolean> => {
  try {
    const {
      useYarn = false,
      useNpm = false,
      usePnpm = false,
      allPassed
    } = await checkPackageTools()
    let command
    const args = ['init', '--yes']
    if (!allPassed) {
      console.log(chalk.red('Please install pnpm or yarn or npm!'))
      process.exit(1)
    } else if (usePnpm) {
      command = 'pnpm'
    } else if (useYarn) {
      command = 'yarnpkg'
    } else {
      command = 'npm'
    }
    const child = spawn.sync(command, args, { stdio: 'ignore', cwd })
    if (child.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`)
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

/**
 * @description 检查文件是否存在
 * @param {string} files
 * @param {string} cwd
 * @return {string} filename
 * @date 2021-06-14 16:47:04
 */
export const checkFileIfExists = (files: string[], cwd: string = process.cwd()): string => {
  if (!files.length) return undefined
  return files.find((file: string) => {
    const filePath = path.resolve(cwd, file)
    const result = fs.pathExistsSync(filePath)
    return fs.pathExistsSync(filePath)
  })
}

/**
 * @description 检查路径是否存在(文件夹)
 * @param {string} filePath
 * @param {*} canDelete 能否被删除
 * @date 2022-04-23 14:36:01
 * @return {Boolean}
 */
export const filePathExist = async (filePath: string, canDelete = false): Promise<boolean> => {
  if (fs.existsSync(filePath)) {
    if (canDelete) {
      const { toBeDeleted } = await inquirer.prompt(deleteExistFileQuestion)
      if (toBeDeleted) {
        fs.removeSync(filePath)
        console.log(chalk.blue(`The file path:${filePath} is deleted successfully`))
        return false
      } else {
        console.log(chalk.red(`The file path:${filePath} already exists`))
        return process.exit(1)
      }
    }
    console.log(chalk.red(`The file path:${filePath} already exists`))
    return process.exit(1)
  } else {
    return false
  }
}

/**
 * @description 复制文件夹
 * @param {*} targetFiles 目标文件夹地址
 * @param {*} souceFiles 需要复制的文件夹地址
 * @date 2022-04-23 15:37:44
 */
export const copyFiles = async (targetFiles: string, souceFiles: string): Promise<void> => {
  try {
    await fs.copy(souceFiles, targetFiles)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

/**
 * @description 读json文件
 * @param {string} jsonFilePath
 * @date 2022-10-11 16:30:18
 * @return {*} 返回解析后的json格式
 */
export const readJson = (jsonFilePath: string) => {
  if (!jsonFilePath) return
  return JSON.parse(fs.readFileSync(jsonFilePath) as any)
}

/**
 * @description 将对象输出为json文件
 * @param {string} writePath
 * @param {any} writeData
 * @date 2022-10-11 16:34:49
 * @return {*}
 */
export const writeJson = ({
  writePath,
  writeData,
  cover = true
}: {
  writePath: string
  writeData: AnyOptions
  cover?: boolean
}) => {
  const existed = filePathExist(writePath, true)
  if (!existed && !cover) {
    throw new Error(`输出Json文件失败，${writePath}已存在`)
  }
  return fs.writeFileSync(writePath, JSON.stringify(writeData, null, 2), 'utf-8')
}

/**
 * @description 将依赖合并到 package.json中
 * @param {*} isDev 是否为开发依赖
 * @param {*} dependencies 需要合并的依赖
 * @date 2022-10-11 16:24:19
 * @return {object} pkg
 */
export const mergePkgDependencies = ({ dependencies = {}, isDev = true }) => {
  if (!dependencies) return
  const pgkPath = path.resolve(process.cwd(), './package.json')

  if (!pgkPath) {
    chalk.red('package.json 文件不存在')
    process.exit(1)
  }
  const originPkg = readJson(pgkPath)
  let dependenciesKey = isDev ? 'devDependencies' : 'dependencies'
  let newPkg = {
    ...originPkg,
    [dependenciesKey]: {
      ...originPkg[dependenciesKey],
      ...dependencies
    }
  }
  return newPkg
}
