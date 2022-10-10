import * as path from 'path'

import { App, AppItem } from '../types/index.js'

export const VUE3_BASIC_APP = 'vue3-basic_app'
export const VUE3_INTEGRATION_APP = 'vue3-integration-app'

export const APP_LIST: AppItem[] = [
  {
    title: 'react + ts + vite + webpack',
    appPath: 'github:fortune-cook1e/react-webpack-template',
    app: App.REACT_INTEGRATION_APP,
    appType: 'react',
    source: 'repo'
  }
  // {
  // 	title: 'react qiankun 基座应用模板',
  // 	appPath: path.resolve(__dirname, '../../../react-qiankun-main-app'),
  // 	app: REACT_QK_MAIN_APP,
  // 	appType: 'react',
  // 	source: 'packages'
  // },
  // {
  // 	title: 'react qiankun 子应用模版',
  // 	appPath: path.resolve(__dirname, '../../../react-qiankun-sub-app'),
  // 	app: REACT_QK_SUB_APP,
  // 	appType: 'react',
  // 	source: 'packages'
  // },
  // {
  // 	title: 'react qiankun 子应用V2模版',
  // 	appPath: path.resolve(__dirname, '../../../react-qiankun-sub-app-v2'),
  // 	app: REACT_QK_SUB_APP_V2,
  // 	appType: 'react',
  // 	source: 'packages'
  // }
  // {
  //   title: 'vue3 基础应用',
  //   appPath: '',
  //   app: VUE3_BASIC_APP,
  //   appType: 'vue',
  //   source: 'packages'
  // },
  // {
  //   title: 'vue3集成多功能应用',
  //   appPath: '',
  //   app: VUE3_INTEGRATION_APP,
  //   appType: 'vue',
  //   source: 'packages'
  // }
]
