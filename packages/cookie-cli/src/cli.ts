import chalk from 'chalk'
import inquirer from 'inquirer'
import minimist from 'minimist'

import { createAppQuestions, createPluginQuestions } from './constants/questions.js'
import { create } from './utils/create.js'
import { getPackageInfo } from './utils/index.js'

class CookieCli {
  public appName?: string
  public constructor(appName?: string) {
    this.appName = appName
  }

  public run(): void {
    this.parseArgs()
  }

  public parseArgs() {
    const argvs = minimist(process.argv.slice(2), {
      alias: {
        version: ['v'],
        help: ['h'],
        create: ['c'], // 创建应用
        plugin: ['p'] // 增加插件
      },
      boolean: ['version', 'help']
    })
    const _ = argvs._
    const command = _[0]
    const appName = _[1]
    this.appName = appName
    if (command) {
      switch (command) {
        case 'create': {
          this.getAppOptions()
          break
        }
        case 'plugin': {
          this.getPluginOptions()
          break
        }
      }
    } else {
      if (argvs.help) {
        console.log('Usage: cookie <command> [options]')
        console.log()
        console.log('Options:')
        console.log('  -v, --version       output the version number')
        console.log('  -h, --help          output usage information')
        console.log('  -c, --create        create react or vue app')
        console.log('  -p, --plugin        create plugin like eslint and so on..')
      } else if (argvs.version) {
        const version = getPackageInfo().version
        console.log(chalk.blue('current cookie-cli version is ' + version))
      } else {
        console.log(chalk.yellow('Please input cookie -h for more commands'))
        process.exit(1)
      }
    }
  }

  public async getAppOptions(): Promise<void> {
    const { app = '' } = await inquirer.prompt(createAppQuestions)
    create({
      createType: 'app',
      createName: this.appName,
      app
    })
  }

  public async getPluginOptions(): Promise<void> {
    const { plugin } = await inquirer.prompt(createPluginQuestions)
    create({
      createType: 'plugin',
      plugin
    })
  }
}

export default CookieCli
