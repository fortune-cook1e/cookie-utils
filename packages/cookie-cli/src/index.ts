import packageJson from '../package.json'

import CookieCli from './cli'
import { checkCurrentNodeVersion } from './utils'

const wantedNodeVersion = packageJson.engines.node

checkCurrentNodeVersion(wantedNodeVersion)

const cookieCli = new CookieCli()
cookieCli.run()
