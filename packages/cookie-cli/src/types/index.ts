export type CreateType = 'app' | 'plugin'

export type AppType = 'react' | 'vue'

export enum App {
  REACT_INTEGRATION_APP, // react 集合多种功能应用
  REACT_BASIC_APP, // react 基础应用
  REACT_QK_SUB_APP, // react qiankun 子应用模板 (react-router-dom 采用v6)
  REACT_QK_MAIN_APP, // react qiankun 基座应用
  REACT_QK_SUB_APP_V2 // react qiankun 子应用模板 v2 (react-router-dom 采用v5)
}

export type Source = 'repo'

export interface CreateParams {
  createType: CreateType
  createPath?: string // 创建路径
  createName?: string // 创建应用的名称
  app?: App
  plugin?: string
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
  plugin: string
  pluginType: 'eslint' | 'stylelint' | 'tsconfig'
  package: 'eslint-config-cookie' | 'stylelint-config-cookie'
  source: 'npm' | 'packages' // 下载来源是npm或是其他
}

export interface QuestionItem {
  type: 'input' | 'list'
  name: string
  message: string
  choices: string[] | { name: string; value: App | string }[]
}
