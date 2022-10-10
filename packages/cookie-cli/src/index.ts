import CookieCli from './cli.js'
import { checkCurrentNodeVersion, getPackageInfo } from './utils/index.js'

const pkg = getPackageInfo()

const wantedNodeVersion = pkg.engines.node

checkCurrentNodeVersion(wantedNodeVersion)

const cookieCli = new CookieCli()
cookieCli.run()
