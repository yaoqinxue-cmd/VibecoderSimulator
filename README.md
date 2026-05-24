# Vibe Coding 模拟器

一个关于“如果你从今天开始 Vibe Coding...”的浏览器文字模拟器。

你会通过一连串选择做出产品、遇到用户、收到账单、处理客服邮件，最后得到一个关于“你变成了什么样的人”的结局。

## 在线试玩

https://yaoqinxue-cmd.github.io/VibecoderSimulator/

## 项目特点

- 一屏一问的轻量游戏流程。
- 40 张事件卡和 12 个身份结局。
- 不接入实时 LLM，所有剧情和结局都由结构化内容驱动。
- 复古未来主义视觉风格，强调秩序感和荒诞感。
- 纯前端静态站点，可直接部署到 GitHub Pages。

## 技术栈

- Vite
- React
- TypeScript
- Vitest
- GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

## 检查命令

```bash
npm run format
npm test
npm run build
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。

- Build command: `npm run build`
- Output directory: `dist`
- Public base path: `/VibecoderSimulator/`

## License

MIT
