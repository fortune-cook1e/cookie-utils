export type CreateType = 'app' | 'plugin'

export type AppType = 'react' | 'vue'

export enum App {
  react_webpack_vite_app = 'react_webpack_vite_app' // react+webpack+vite
  // REACT_QK_SUB_APP, // react qiankun 子应用模板 (react-router-dom 采用v6)
  // REACT_QK_MAIN_APP, // react qiankun 基座应用
}

export enum Plugin {
  EslintReactTs = 'eslint-react-ts', // react + ts 的eslint插件
  TsNodeEsm = 'ts-node-esm', // tsconfig的esm环境开发
  StylelintLess = 'stylelint-less', // stylelint
  Prettier = 'prettier' // prettier配置
}

export type Source = 'repo'

export interface CreateParams {
  createType: CreateType
  createPath?: string // 创建路径
  createName?: string // 创建应用的名称
  app?: App
  plugin?: Plugin
}

export interface DownloadAppParams {
  createPath?: string
  createName: string
  appInfo: AppItem
}

export interface AnyOptions {
  [propname: string]: any
}

export interface AppItem {
  title: string
  appPath: string
  app: App
  appType: AppType
  source: Source // app来源是repo还是当前lerna项目其他目录
}

export interface PluginItem {
  title: string
  plugin: Plugin
  // pluginType: 'eslint' | 'stylelint' | 'tsconfig'
  // package: 'eslint-config-cookie' | 'stylelint-config-cookie'
  // source: 'npm' | 'packages' // 下载来源是npm或是其他
}

export interface QuestionItem {
  type: 'input' | 'list'
  name: string
  message: string
  choices: string[] | { name: string; value: App | string }[]
}

export interface PluginConfigJson {
  config: AnyOptions
  checkFiles: string[]
  devDependencies?: AnyOptions
  dependencies?: AnyOptions
  output: {
    file: '.prettierrc'
  }
}
