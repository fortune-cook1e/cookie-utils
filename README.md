# cookie-utils

公用工具包～

## pnpm 多包管理命令记录

-D:dev 依赖
-W: 依赖安装到根目录
-r: 依赖安装到每个包中
-F: --filter 缩写,将依赖安装到某个包

- 添加全局依赖 pnpm add xxx -D -W
- 添加局部依赖 pnpm add xx -r -F packageA
- --save-peer 安装到peerDependencies和devDependencies中
- npm publish --access public 发布包

## pnpm 执行软链接

- cd foo and pnpm link --global
- cd bar and pnpm link --global foo
