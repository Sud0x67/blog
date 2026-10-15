# Sud0x67's Blog

- 博客：[sud0x67.github.io/blog/](https://sud0x67.github.io/blog/)
- 源码：[Sud0x67/blog](https://github.com/Sud0x67/blog)
- 项目与工具导航：[sud0x67.github.io](https://sud0x67.github.io/)，由独立的 `Sud0x67.github.io` 仓库维护。

本项目从原 Hexo 备份恢复，保留原 Git 历史、四篇文章的 Markdown 和 Cxo 主题。博客单独发布，更新文章不会覆盖项目导航首页。

## 环境与本地预览

使用 Node.js 24（`.nvmrc`）和 npm。构建依赖已有锁文件。

```sh
cd ~/code/blog
# 使用 nvm 时运行：nvm use
npm ci
npm run build
npm run server
```

浏览器访问 <http://localhost:4175/blog/>。本地也使用 `/blog/` 子路径，与线上保持一致。

## 写文章与发布

```sh
npm run new -- post "文章标题"
```

编辑 `source/_posts/文章标题.md` 中的标题、日期、标签和正文，然后预览：

```sh
npm run build
npm run server
```

确认内容后提交源码：

```sh
git add source/_posts
git commit -m "Add a blog post"
git push origin main
```

GitHub Actions 会自动安装锁定依赖、构建、检查全部站内链接、验证新文章生成流程并运行浏览器测试，再通过官方 Pages Actions 发布 `public/`。文章归档和标签页由 Hexo 自动维护。

**不要向导航仓库发布 Hexo 产物。** 本项目已移除旧 `hexo-deployer-git` 插件和指向根站的部署配置，不再使用旧的 `hexo deploy`；只需推送本仓库的 `main` 分支。

草稿可用 `npm run new -- draft "草稿标题"` 创建，默认不会发布。文章固定链接仍为 `年/月/日/标题/`，只是加上 `/blog/` 前缀。根站保留旧文章、归档、标签和关于页地址的兼容跳转。

## 目录

- `source/_posts/`：文章 Markdown。
- `source/about/`、`source/tags/`：关于页和标签入口。
- `_config.yml`：站点配置，`url` 与 `root` 固定为博客子路径。
- `themes/Cxo/`：当前启用的 Cxo 主题，包含原作者 MIT 许可证。
- `themes/Cxo/source/css/blog.css`：恢复时添加的移动端与交互修正。
- `themes/Cxo/source/js/blog.js`：资料开关、移动导航、阅读进度、返回顶部和原生图片预览。
- `themes/Cxo_bak/`、`themes/landscape/`：原 Git 历史中已保存的其他主题，当前未启用。
- `tooling/`：字体验证/复制、站内链接检查和隔离写作测试。不要改名为 `scripts/`，Hexo 会自动加载并执行该目录中的脚本。
- `.github/workflows/pages.yml`：独立的构建与 Pages 发布流程。
- `public/`、`db.json`、`source/vendor/`：自动生成内容，不提交。

Cxo 原有的预编译样式保留。日常改样式可编辑 `themes/Cxo/source/css/blog.css`；当前构建不依赖旧主题工具链中的 Node Sass / Webpack 4，也不需在主题目录执行 `npm install`。主题图片、图标字体和交互脚本由站点本地提供，默认不加载统计、CDN 或评论服务。原 MySQL 文章中的历史外链图片仍保持原始来源。

## 验证

```sh
npm run build
npm run check:authoring
npx playwright install chromium firefox webkit
npm test
```

链接检查覆盖所有生成 HTML/CSS 的本站资源、文章、导航和标签路径；写作检查在临时副本中创建测试文章，验证页面与归档，不修改真实文章。浏览器测试覆盖 Chrome、Firefox、Safari 内核和移动端，包括文章刷新、标签、菜单、资料开关、窄屏和图片预览。

当前 npm 审计报告的上游告警来自 Hexo 构建链的 `braces` / `sprintf-js` 及其引用者；恢复时 npm 官方源尚无对应修复版。这些包不作为脚本发送到访问者浏览器。依赖升级时应重新执行审计、完整构建和浏览器测试，不使用 `npm audit fix --force` 将 Hexo 降级。

## GitHub Pages 配置

仓库 Settings → Pages → Source 选择 **GitHub Actions**。默认分支为 `main`。部署环境为 `github-pages`，地址为 <https://sud0x67.github.io/blog/>。

参见 [Hexo 的 GitHub 项目站点说明](https://hexo.io/docs/github-pages#Project-page)和[子目录配置说明](https://hexo.io/docs/configuration#URL)。
