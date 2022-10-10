import path from 'node:path'

import chalk from 'chalk'
import download from 'download-git-repo'
import fs from 'fs-extra'
import ora from 'ora'

import { APP_LIST } from '../constants/app.js'
import { CreateParams, DownloadAppParams } from '../types/index.js'

import { filePathExist, copyFiles } from './index.js'

const DEFAULT_CREATE_PATH = process.cwd()

export async function create({
  createType = 'app',
  createName = '', // 创建文件夹名称
  app,
  plugin = ''
}: CreateParams): Promise<void> {
  try {
    const isApp = createType === 'app'
    if (isApp) {
      await createApp({
        createName,
        app
      })
    } else {
      // createPlugin({
      //   pluginType,
      //   pluginTemplate,
      //   createPath
      // })
    }
  } catch (e) {
    console.log(e)
  }
}
/**
 * @description 创建 app
 * @date 2022-10-10 17:43:13
 */
const createApp = ({ app, createName = '' }) => {
  const currentCreateAppInfo = APP_LIST.find(a => a.app === app)
  if (currentCreateAppInfo) {
    downloadApp({ appInfo: currentCreateAppInfo, createName })
  } else {
    console.log(chalk.red(`The template ${app} is invalid!`))
    process.exit(1)
  }
}

// 下载应用
const downloadApp = async ({
  createPath = DEFAULT_CREATE_PATH,
  appInfo,
  createName = ''
}: DownloadAppParams) => {
  const { appPath, source } = appInfo
  const templatePath = path.join(createPath, createName)
  // 如果目录存在则直接删除
  const templatePathExist = await filePathExist(templatePath, true)
  if (!templatePathExist) {
    fs.mkdirSync(templatePath)
  }

  // 根据来源创建项目
  // 如果是repo类型 则从对应的 repo 地址下载即可
  // 如果是packages 则是从 packages 目录下 copy 过来
  switch (source) {
    case 'repo':
      return downloadFromRepo({ repoPath: appPath, templatePath })
    // case 'packages':
    //   return downloadFromPackages({ localPath: appPath, templatePath })
    default: {
      console.log(chalk.red(`The source ${source} is invalid!`))
      process.exit(1)
    }
  }
}

const downloadFromRepo = ({ repoPath = '', templatePath = '' }) => {
  const spinner = ora('正在拉取仓库模板～').start()
  spinner.color = 'yellow'
  const name = path.basename(templatePath)
  download(repoPath, name, err => {
    if (err) {
      spinner.color = 'red'
      spinner.fail(chalk.red('拉取远程模板仓库失败！'))
      console.log({ err })
      process.exit(1)
    }
    spinner.color = 'green'
    spinner.succeed(`${chalk.blue('拉取远程模板仓库成功！')}`)
  })
}

const downloadFromPackages = async ({ localPath = '', templatePath = '' }) => {
  const spinner = ora('正在拉取模板~').start()
  spinner.color = 'yellow'
  try {
    await copyFiles(templatePath, localPath)
    spinner.color = 'green'
    spinner.succeed(`${chalk.blue('拉取模板成功！')}`)
  } catch (e) {
    spinner.color = 'red'
    spinner.fail(chalk.red('拉取模板失败！'))
    process.exit(1)
  }
}
