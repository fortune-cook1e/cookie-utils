// import CookieCli from './cli'

import packageJson from '../package.json'

import { checkCurrentNodeVersion } from './utils/index.js'

const wantedNodeVersion = packageJson.engines.node

checkCurrentNodeVersion(wantedNodeVersion)
console.log('gaga')

// const cookieCli = new CookieCli()
// cookieCli.run()
