# Vibe Coding 模拟器工程化落地文档

日期：2026-05-24

## 一句话目标

Vibe Coding 模拟器是一款 15-20 分钟完成一局的浏览器文字模拟器：玩家从今天开始 Vibe Coding，通过一连串单屏选择，最终看到自己变成了什么样的人。

第一版目标不是做完整人生大地图，也不是做 AI 自由文本冒险，而是验证：

- 玩家是否能在 30 秒内理解玩法。
- 玩家是否愿意连续完成 15-20 分钟的单屏选择。
- 玩家是否会觉得结局像自己、好笑但不被羞辱。
- 玩家是否愿意截图或转述自己的结局页。

## 第一版范围

必须做：

- 单页 Web 应用，打开即玩。
- 一条固定人生主线：第一次开挂、世界开始回应、你变成了谁。
- 40-60 张结构化事件卡。
- 每个问题都是单屏回合，不需要上下滑动。
- 4 个指标：推进感、判断力、主体性、稳定度。
- 8-12 个身份结局。
- 结局页：标签、短注释、结果描述、四个指标、关键人生选择、最近痕迹。
- 本地存档：继续上一局、重新开始。
- 复古未来主义视觉风格。

第一版不做：

- 不接实时大语言模型。
- 不做账号、登录、排行榜、支付。
- 不做路径复现链接或单独分享卡。
- 不做完整项目经营系统。
- 不做职业大地图和多主角开局。
- 不引入后端服务，除非后续有明确数据需求。

## 技术方案

推荐方案：Vite + React + TypeScript。

原因：

- 纯前端即可覆盖第一版需求，部署和加载最轻。
- 游戏核心是状态机、内容数据和单屏 UI，不需要 Next.js 的服务端能力。
- TypeScript 能约束事件卡、选择、指标和结局条件，减少内容维护错误。
- 后续如果需要服务端能力，可以再迁移或接入 API，不在第一版提前背负复杂度。

建议依赖保持克制：

- UI：React + CSS Modules 或普通 CSS。
- 状态：React reducer 或轻量 Zustand；如果状态机逻辑不复杂，优先 reducer。
- 测试：Vitest + Testing Library。
- 端到端和截图验证：Playwright。
- 数据校验：Zod 或自写轻量 validator。若内容结构稳定，优先 Zod。

## 部署方案

第一版部署到 GitHub Pages，并保持仓库开源。

- 仓库：`yaoqinxue-cmd/VibecodingSimulator`
- 页面地址：`https://yaoqinxue-cmd.github.io/VibecodingSimulator/`
- 构建方式：GitHub Actions 自动运行 `npm ci` 和 `npm run build`
- 发布产物：`dist`
- Vite `base`：`/VibecodingSimulator/`

选择 GitHub Pages 的原因：

- 源码、项目介绍和在线试玩集中在同一个公开仓库。
- 每次 push 到 `main` 后自动构建和部署，不需要手动上传产物。
- 第一版是纯前端静态站点，不需要 Cloudflare Workers 或后端服务。
- GitHub Pages 对开源传播更自然，用户可以直接从页面回到仓库。

## 推荐目录结构

```txt
src/
  app/
    App.tsx
    routes.ts
  game/
    engine.ts
    reducer.ts
    scoring.ts
    storage.ts
    types.ts
  content/
    cards.ts
    endings.ts
    constants.ts
  ui/
    screens/
      StartScreen.tsx
      EventScreen.tsx
      FeedbackScreen.tsx
      ResultScreen.tsx
    components/
      ChoiceButton.tsx
      StatMeter.tsx
      StatusLights.tsx
      TraceList.tsx
  styles/
    theme.css
    layout.css
tests/
  engine/
  content/
  e2e/
```

## 核心数据模型

事件卡必须结构化，避免后期变成难维护的散文分支。

```ts
type Phase = "awakening" | "response" | "identity";

type StatKey = "momentum" | "judgment" | "agency" | "stability";

type StatEffect = Partial<Record<StatKey, number>>;

type Condition =
  | { type: "hasFlag"; flag: string }
  | { type: "statGte"; stat: StatKey; value: number }
  | { type: "statLte"; stat: StatKey; value: number }
  | { type: "turnGte"; value: number };

type Choice = {
  id: string;
  label: string;
  effects: StatEffect;
  immediateLine: string;
  addFlags?: string[];
  addTraces?: Trace[];
  nextCardId?: string;
};

type Card = {
  id: string;
  phase: Phase;
  title: string;
  body: string;
  choices: Choice[];
  conditions?: Condition[];
  weight?: number;
};

type Trace = {
  type: "work" | "habit" | "relation" | "reputation" | "cost";
  text: string;
};

type GameState = {
  currentCardId: string;
  phase: Phase;
  turn: number;
  stats: Record<StatKey, number>;
  flags: string[];
  traces: Trace[];
  history: Array<{
    cardId: string;
    choiceId: string;
  }>;
  seed: string;
};

type Ending = {
  id: string;
  label: string;
  shortNote: string;
  stateLine: string;
  description: string;
  conditions: Condition[];
  priority?: number;
};
```

## 游戏引擎规则

第一版用确定性规则，不用运行时生成剧情。

- 初始化：生成 seed，创建初始指标和第一张卡。
- 选项结算：应用指标变化、flags、traces、history。
- 下一卡选择：优先使用 `nextCardId`，否则从当前 phase 的可用卡池里按条件和权重选择。
- 阶段推进：根据 turn 数、关键 flags 或阶段目标进入下一幕。
- 结局判定：结束时按条件匹配结局；如果多个结局命中，按优先级或得分选一个。
- 防死局：任何阶段都必须有至少一张 fallback card。

指标建议范围：

- 内部数值使用 `0-100`。
- UI 不显示精确数字，只显示 `低 / 中 / 高 / 爆表 / 失控`。
- 每次选择的变化幅度控制在 `-12` 到 `+12`，避免两三步就失控。
- 指标不是越高越好，过高和过低都能触发不同结局或事件。

## 单屏交互实现

主流程是“一屏一问一回合”。

布局要求：

- `EventScreen` 使用 `min-height: 100dvh`。
- 主问题、选项、必要状态信息必须在手机首屏完整可见。
- 主流程不依赖页面滚动。
- 文案超过单屏容量时，优先拆成下一张卡。
- 结果页首屏必须完整展示结局标签、短注释和核心指标；长描述可放入同屏详情区域、展开层或分页模块。

建议屏幕结构：

- 顶部：产品名、阶段、回合编号、状态灯。
- 中部：事件标题和正文。
- 下方：2 个主选择，关键节点可用 3 个。
- 底部或侧边：四个指标的轻量显示。

移动端优先：

- 以 `390x844` 和 `360x800` 作为最小验证视口。
- 不使用需要精细 hover 的交互。
- 选项按钮高度足够，避免误触。
- 字号不随视口宽度线性缩放。

## 视觉系统

方向：复古未来主义，有秩序感，也有荒诞感。

视觉原则：

- 页面像旧式电脑、航天控制台或企业内网评估报告。
- 严肃界面记录荒诞人生状态，反差就是笑点的一部分。
- 使用网格、编号、状态灯、指标条、字段标签和细线框。
- 避免大面积紫蓝渐变和普通赛博朋克套路。
- 优先使用深色底、低饱和灰、荧光绿或琥珀色点缀。
- 可使用轻微扫描线和终端质感，但不能损害可读性。

需要定义的基础 token：

- 背景色、面板色、边框色。
- 主文本、副文本、弱文本。
- 成功、警告、危险、系统提示。
- 指标条颜色。
- 按钮默认、hover、active、disabled。
- 字体层级：标题、事件正文、选项、指标、辅助标签。

## 内容生产规范

每张事件卡必须满足：

- 一个清晰情境。
- 一个真实冲突或诱惑。
- 2 个主选择，少量关键卡可 3 个。
- 每个选择都有即时反馈。
- 至少影响一个指标，最好同时留下一个人生痕迹。
- 不把正确答案写得太明显。
- 不用长段解释代替机制后果。

内容 lint 规则建议：

- `body` 字数上限：建议 80-120 个汉字。
- `choice.label` 字数上限：建议 24 个汉字。
- `immediateLine` 字数上限：建议 40 个汉字。
- 每张卡 choices 数量为 2 或 3。
- 每张卡至少有一个 effect。
- 每个 phase 至少有 1 张 fallback card。
- 每个 ending 至少有 2-3 条可解释的触发线索。

## 本地存档

第一版只做本地存档。

存储内容：

- 当前 `GameState`。
- 是否完成过一局。
- 最近一次结局 id。

存储方式：

- 使用 `localStorage`。
- 加版本号，例如 `vibe-coding-sim:v1`.
- 如果 schema 版本不匹配，提示重新开始，不做复杂迁移。

## 测试策略

必须覆盖：

- 引擎单元测试：选项结算、指标 clamp、flags/traces 写入、阶段推进。
- 结局判定测试：每个结局至少有一条可达路径。
- 内容完整性测试：卡片 id 唯一、引用有效、choices 合法、无死局。
- 单屏 UI 测试：手机和桌面视口下主流程不出现页面滚动。
- 结果页测试：首屏展示标签、短注释、核心指标。
- 存档测试：刷新后可恢复，重新开始可清空。

建议不要第一版追求复杂自动化剧情覆盖率；更重要的是确保内容不会断、不会越界、不会让玩家卡住。

## 性能和体验预算

首屏目标：

- 本地构建后主 bundle 尽量小于 250KB gzip。
- 首屏无远程 AI 请求。
- 首屏不依赖大图和外部字体。
- 交互响应低于 100ms。

体验约束：

- 第一次打开 30 秒内进入第一道题。
- 每次选择后 300ms 内出现反馈。
- 动效只服务节奏，不阻塞玩家继续。
- 任何阶段都可以重新开始。

## 里程碑 Checklist

### P0：工程骨架

- [x] 初始化 Vite + React + TypeScript 项目。
- [x] 建立 `src/game`、`src/content`、`src/ui` 目录。
- [x] 配置 lint、format、test。
- [x] 创建基础主题变量和全局布局。
- [x] 跑通一个静态 StartScreen。

验收标准：

- [x] `npm run dev` 可以打开页面。
- [x] `npm test` 可以运行。
- [x] 页面不依赖后端服务。

当前验收记录：`npm test` 通过，`npm run build` 通过，本地 Vite 服务已在 `http://127.0.0.1:5173/` 验证可打开。

### P1：游戏引擎

- [x] 定义 `Card`、`Choice`、`GameState`、`Ending` 类型。
- [x] 实现初始化游戏状态。
- [x] 实现选择结算。
- [x] 实现下一卡选择。
- [x] 实现阶段推进。
- [x] 实现结局判定。
- [x] 实现本地存档和重新开始。

验收标准：

- [x] 能从第一张卡一路玩到结局。
- [x] 所有指标变化稳定可追踪。
- [x] 刷新页面后能继续。
- [x] 没有可触发的死局。

当前验收记录：引擎测试覆盖初始化、选择结算、反馈推进和完整路径到结局；内容测试覆盖卡片合法性、结局完整性和指标引用。

### P2：单屏主流程 UI

- [x] 实现 StartScreen。
- [x] 实现 EventScreen。
- [x] 实现 FeedbackScreen 或同屏反馈状态。
- [x] 实现 StatMeter 和 StatusLights。
- [x] 实现 ResultScreen。
- [x] 确保事件卡按 `100dvh` 单屏布局。
- [x] 做手机和桌面响应式。

验收标准：

- [x] 主流程在 `390x844` 下不需要上下滑动。
- [x] 主流程在桌面下不会显得像表单。
- [x] 每次选择都有即时反馈。
- [x] 结果页首屏能看到标签、短注释和核心指标。

当前验收记录：桌面和近似手机宽度均已打开检查；UI 测试覆盖 StartScreen、EventScreen 和 ResultScreen 的核心信息。

### P3：内容落地

- [x] 把 20 个核心人生节点转成第一批事件卡。
- [x] 补齐到 40-60 张事件卡。
- [x] 把 12 个结局页转成结构化 endings。
- [x] 为每个结局配置触发条件。
- [x] 为事件卡补充 flags 和 traces。
- [x] 写内容校验脚本或测试。

验收标准：

- [x] 每个 phase 至少有 10 张可用卡。
- [x] 每个结局都有可达路径。
- [x] 文案在手机首屏内可读。
- [x] 没有明显“正确答案”式选择。

当前验收记录：事件池已扩到 40 张；三幕均超过 10 张卡；12 个结局已结构化；内容完整性测试已纳入 `npm test`。

### P4：视觉和手感

- [x] 建立复古未来主义视觉主题。
- [x] 设计状态灯、指标条、细线框和系统编号。
- [x] 增加轻量转场和反馈动效。
- [x] 优化按钮、键盘可访问性和触屏点击区域。
- [x] 统一结果页视觉层级。

验收标准：

- [x] 页面有明确辨识度，不像普通问卷。
- [x] 动效不影响阅读和选择速度。
- [x] UI 在手机和桌面都不拥挤。
- [x] 截图能看出这是 Vibe Coding 模拟器。

当前验收记录：已实现深色网格、状态灯、指标条、细线框、系统编号、轻量入场动效和 reduced-motion 保护；桌面与近似手机宽度已做人工视觉检查。

### P5：验证和打磨

- [ ] 用 Playwright 跑主路径。
- [ ] 截图检查手机和桌面视口。
- [ ] 做 5 个目标用户纸面或可点击原型测试。
- [ ] 记录玩家卡住、笑出声、想截图和觉得刻薄的位置。
- [ ] 根据反馈调整 10-20 张卡和 3-5 个结局描述。
- [ ] 再做一次内容可达性测试。

验收标准：

- [ ] 5 个测试用户都能在 30 秒内理解玩法。
- [ ] 至少 3 个用户愿意截图或转述结局。
- [ ] 没有用户因为术语太多而中途放弃。
- [ ] 没有用户认为结局是在骂自己。

当前打磨记录：已完成一轮选项差异排查，把偏抽象的“先处理 / 先答应 / 造声量”改成更具体的行动；反馈页主按钮从“进入下一屏”改为“继续”，降低流程感。

## 发布前 Checklist

- [ ] 首页加载正常。
- [ ] 重新开始正常。
- [ ] 刷新恢复正常。
- [ ] 一局能稳定完成。
- [ ] 所有结局都能触发。
- [ ] 主流程手机端不滚动。
- [ ] 结果页首屏信息完整。
- [ ] 无实时 LLM 请求。
- [ ] 无登录、支付、排行榜入口。
- [ ] 无控制台错误。
- [ ] 无明显布局重叠。
- [ ] 无过长文案撑破按钮。
- [ ] 文案没有真实品牌风险。
- [ ] 复古未来主义风格统一。

## 第一版完成定义

当玩家可以在浏览器中打开 Vibe Coding 模拟器，连续完成一局 15-20 分钟的单屏选择，并得到一个有辨识度、可截图、让人想转述的结局页时，第一版完成。

第一版成功的判断不是“系统多复杂”，而是：

- 选择是否让人愿意继续点。
- 反馈是否立刻有趣。
- 结局是否像一种真实的人生状态。
- 玩家是否觉得“这有点像我，离谱，但也对”。
