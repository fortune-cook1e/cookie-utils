# cookie-utils

公用工具包～

## pnpm 多包管理命令记录

- 添加全局依赖 pnpm add xxx -D -W
- 添加局部依赖 pnpm add xx -r --filter packageA
- npm publish --access public 发布包

## pnpm 执行软链接

- cd foo and pnpm link --global
- cd bar and pnpm link --global foo
