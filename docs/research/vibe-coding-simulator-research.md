# Vibe Coding 模拟器调研备忘录

调研日期：2026-05-24

## 结论先行

Vibe Coding 模拟器不应该先做成“无限 AI 文本冒险”，也不应该先做成完整经营模拟器。更准确的方向是一个“人的选择模拟器”：玩家从现在开始 Vibe Coding，通过一连串选择，最终成为某种人、处于某种状态。项目、产品、代码库和用户只是人生轨迹的事件载体，不是最终主题。

最短路径仍然建议先做成可在浏览器里 15-20 分钟完成一局的讽刺模拟器：用强作者控制的事件卡、少量清晰数值、确定性随机种子和有截图记忆点的结果页，先验证幽默、启发和传播性。

核心体验建议是：玩家不是单纯“写代码的人”，而是一个在 AI 时代重新分配时间、能力、欲望、判断力和社会身份的人。游戏的乐趣来自“我好像突然能做很多东西”和“我到底变成了什么样的人”之间的张力。

## 对标产品观察

| 产品                                                                         | 主要机制                                                 | 技术/形态线索                                                                                   | 对 Vibe Coding 模拟器的启发                                                                                                        |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Universal Paperclips](https://www.decisionproblem.com/paperclips/)          | 从单按钮开始，逐步展开资源、自动化、研究、宇宙级叙事     | 浏览器增量游戏；Frank Lantz 官方介绍为 4-6 小时体验；Wired 提到项目起初是学习 JavaScript 的练习 | 好的模拟器可以从极小操作开始，用“系统逐渐失控”制造叙事。Vibe Coding 模拟器可以从一个 prompt 开始，逐步长出代码库、用户、成本和事故 |
| [The Password Game](https://neal.fun/password-game/)                         | 一个输入框，不断叠加越来越荒诞的规则                     | 免费网页游戏，后有 iOS 版本                                                                     | 传播点来自清晰任务、递增约束和截图友好。Vibe Coding 模拟器可以把“再加一个需求”设计成规则叠加，而不是复杂剧情树                     |
| [Stimulation Clicker](https://neal.fun/stimulation-clicker/)                 | 点击获得点数，升级内容不断占满屏幕                       | 2025 年 Neal Agarwal 网页 clicker；公开报道提到 4 个月开发、包含定制音频内容                    | 幽默不是段子堆砌，而是机制表达主题。Vibe Coding 模拟器可以让“工具、通知、自动修复、指标”逐层挤占玩家注意力                         |
| [Infinite Craft](https://neal.fun/infinite-craft/)                           | 两两组合元素，AI 生成未知结果，“First Discovery”强化分享 | Web/iOS/Android；公开资料称未见组合会由 LLaMA 系列模型生成并入库                                | AI 最适合放在“惊喜生成器”和“可炫耀发现”位置，不宜承担核心规则正确性                                                                |
| [BitLife](https://apps.apple.com/us/app/bitlife-life-simulator/id1374403536) | 年度推进、属性、关系、职业和随机事件                     | App Store 定位为 text-based life simulator；强调选择逐年堆叠、每局不同                          | 适合学习“人生阶段推进”和“事件池”。Vibe Coding 模拟器应按人的阶段推进：入坑、产出、暴露、身份分化、结局                             |
| [Reigns](https://www.devolverdigital.com/games/reigns)                       | 每张卡二选一，维护四个指标，死亡后继承进度               | Devolver 官方介绍为左右滑动决策，平衡教会、人民、军队、财政                                     | 二选一和四指标非常适合移动端、短局和幽默反转。Vibe Coding 模拟器可以用四个指标表达工程权衡                                         |
| [The Founder](https://thefounder.biz/)                                       | 创业经营、产品发布、市场份额、公司扩张和讽刺叙事         | 浏览器游戏；第三方资料记录为开源 JavaScript 项目                                                | 说明“技术行业讽刺模拟器”有成立空间，但系统深度很容易膨胀。Vibe Coding 模拟器第一版要避免做完整创业 tycoon                          |
| [AI Dungeon](https://apps.apple.com/us/app/ai-dungeon/id1491268416)          | AI 作为叙事引擎，玩家自由输入动作                        | 官方 App Store 描述强调 AI-native RPG、记忆系统、动态故事                                       | AI 沙盒自由度强，但也带来一致性、内容质量、成本和时延风险。Vibe Coding 模拟器应保留作者写好的叙事骨架                              |

## 常见技术框架

### 1. 纯 Web 方案

适合 Vibe Coding 模拟器的第一阶段。建议使用 TypeScript + React 或 Vite/Next，事件引擎用普通 TypeScript 数据结构实现，状态管理保持轻量。优点是传播门槛最低，打开即玩，截图和转述成本低，工程复杂度可控。

不建议第一阶段上 Unity/Godot/Phaser，除非核心玩法变成动画、物理或大量 2D 交互。文字模拟器的关键不在渲染能力，而在事件系统、节奏、文案和反馈速度。

可参考：

- [Phaser](https://docs.phaser.io/phaser/getting-started/what-is-phaser)：适合 HTML5 Canvas/WebGL 2D 游戏，但对纯文字模拟器偏重。
- [Godot](https://godotengine.org/)：适合 2D/3D 游戏和多平台发布，但第一版浏览器文字游戏未必需要。

### 2. 互动叙事工具

这些工具适合原型或强叙事项目，但 Vibe Coding 模拟器如果要有资源、状态、事件池和结局页，最终仍建议自研轻量事件引擎。

| 工具                                                                                  | 适合                                      | 不适合                                         |
| ------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| [Twine](https://twinery.org/)                                                         | 快速做非线性故事原型；可导出 HTML         | 后期维护复杂状态、指标和内容测试会吃力         |
| [Ink](https://github.com/inkle/ink)                                                   | 强分支叙事，可编译 JSON，有 JS/C# runtime | 如果游戏主要是数值模拟，Ink 会成为旁路系统     |
| [ChoiceScript](https://www.choiceofgames.com/make-your-own-games/choicescript-intro/) | 长篇多选文字小说，变量和场景组织成熟      | 更像互动小说出版管线，不太适合病毒式网页玩具   |
| [Ren'Py](https://www.renpy.org/)                                                      | 视觉小说、角色图、音频、存档和多平台打包  | Web 传播和即时打开不如纯 Web；对当前第一版偏重 |

### 3. AI 的使用位置

建议第一阶段不把大语言模型放在每次点击的主路径里。原因是时延、成本、不可控输出和审核都会直接伤害节奏。更稳的方式是：

- 核心循环使用作者写好的事件卡和确定性规则。
- 第一版不接入实时大语言模型；如果未来增加 AI 惊喜层，也只用于低频、可缓存、可异步的内容，例如生成代表作品名、离谱 issue 标题或用户评论。
- 所有生成内容必须按状态缓存，避免同一局前后不一致。
- 如果后续接入 AI，产品层面明确标注“AI 生成惊喜内容”，不要把它伪装成规则系统的一部分。

## 流程、时长和剧情线建议

### 建议时长

第一版建议做一局 15-20 分钟，而不是 4-6 小时。这里的一局不是“一个项目”，而是一次压缩的人生分支：从第一次认真 Vibe Coding 到形成一种身份状态。原因：

- Vibe Coding 人群更容易被短、准、可转发的体验打中。
- 短局便于反复测试幽默密度和选择反馈。
- 浏览器游戏的传播链路需要“我刚玩完，马上发给你”。

节奏建议：

| 阶段                 | 时长     | 玩家感受                       | 设计目标                               |
| -------------------- | -------- | ------------------------------ | -------------------------------------- |
| 冷启动               | 30-60 秒 | 一句话理解玩法                 | 不讲教程，直接给第一个提示词           |
| 第一幕：第一次开挂   | 3-5 分钟 | “这也太快了”                   | 建立爽感和荒诞基调                     |
| 第二幕：世界开始回应 | 5-7 分钟 | 朋友、用户、同事、平台开始反馈 | 让玩家意识到作品会改变现实关系         |
| 第三幕：你变成了谁   | 5-7 分钟 | 你开始选择自己成为什么人       | 把前面选择变成职业、生活和自我认知后果 |
| 结局：人生状态页     | 1-2 分钟 | 看到自己的最终身份和状态       | 输出可截图、可回看的身份结果页         |

后续如果内容验证成功，可以做“章节制”：每章 15-20 分钟，三章构成 60 分钟左右的完整季。

### 核心循环

推荐循环：

1. 玩家看到一张事件卡：灵感、工具、需求、朋友评价、用户评论、工作冲突、上线事故、AI 助手行为、生活状态。
2. 玩家做一个短选择：通常二选一，偶尔三选一。
3. 系统立即反馈：指标变化、提交记录、测试结果、用户吐槽、AI 助手解释。
4. 选择写入状态：影响后续事件权重、解锁伏笔回收或结局。
5. 达到阶段阈值后进入下一幕。

这个循环的关键是“短读、快选、即时笑点、延迟后果”。不要让玩家读长段世界观，也不要让玩家在早期管理十几个指标。

### 单屏问题设计

第一版主流程建议采用“一屏一问一回合”：每个事件问题占满整个屏幕，玩家不需要上下滑动。这样文字游戏也能获得轻度游戏化沉浸感，因为玩家每次面对的是一个完整场景，而不是一段连续表单。

单屏问题的设计约束：

- 事件正文、2-3 个选择、必要状态信息必须在手机和桌面首屏内完整可见。
- 单题只表达一个冲突或诱惑，不把背景、后果和解释都塞进去。
- 反馈要短，优先用一句话、状态灯、指标微动效或作品痕迹表达。
- 如果一个事件需要解释很多，拆成连续两屏，而不是让玩家滚动。
- 结果页也要首屏完整表达最终身份；长描述可以放到同屏模块切换或折叠详情里。

### 指标设计

建议从四个指标开始，借鉴 Reigns 的清晰度，但指标应该描述“人”，不是只描述“项目”：

- 推进感：速度、产出、热度。
- 判断力：理解需求、知道什么该做什么该删、识别 AI 编出来的内容。
- 主体性：自主选择、是否仍由你决定方向。
- 稳定度：生活、健康、现金流、关系和长期节奏。

四个指标都不能只是“越高越好”。例如推进感太高会触发“你在没有理解代码的情况下连发 17 个版本”；主体性太低会触发“你的 AI 助手开始替你决定人生目标”；判断力太高但推进感太低会触发“你把每个周末都用来重写架构图”。这样失败会更幽默，也更有启发性。

### 剧情主线

建议第一版只做一条人生主线，不做多职业大地图：

> 你从今天开始认真 Vibe Coding。最初一切都像魔法：你能在一晚做出过去一个月才敢想的东西。很快，作品、用户、同事、朋友、账单、身份认同和你自己的欲望开始一起涌来。你不是只在决定产品怎么做，而是在决定自己要成为什么样的人。

可选结局示例：

- “真有人在用！”：真的能跑，而且有人把它放进了每天的工作里！
- “复杂意图解构师”：别人还在喊“做个大的”，你已经把混沌拆成了三个小问题。
- “录屏演示之王”：视频里像未来产品，现场像随机抽奖。
- “自动化上瘾者”：你不是懒，你只是把人生也接进了工作流。
- “成功人设”：产品还在修，成功学封面已经做好了。
- “无聊但OK”：没有传奇故事，但有续费、睡眠和一个没人骂你的周一。

## 结果页与传播性设计

第一版不做单独分享卡、路径复现链接或发现系统。传播性来自结果页本身足够有辨识度：玩家看完愿意截图、转述或把标签发给朋友。

- 结果页：身份标签、短注释、当前状态、四个指标、代表作品、三条人生事件。
- 视觉风格：偏复古未来主义，有旧式系统报告的秩序感，也有严肃记录荒诞人生状态的反差。
- 短视频友好：每 2-3 分钟出现一次强视觉/文案变化，比如仪表盘新增一块、CI 日志爆红、用户增长图突然反转。
- 不依赖登录：第一版不要账号、排行榜和社交绑定，避免首屏负担和隐私成本。

## 短期和长期风险

| 风险                       | 短期影响                 | 长期隐患                         | 建议                                             |
| -------------------------- | ------------------------ | -------------------------------- | ------------------------------------------------ |
| 完全依赖大语言模型驱动剧情 | 每步等待、输出质量不稳定 | 内容审核、成本、剧情失控         | 第一版以作者内容为主，大语言模型只做低频惊喜     |
| 梗太内圈                   | 新玩家看不懂             | 传播圈层过窄                     | 梗分层：表层是“做产品真混乱”，深层才是工程笑话   |
| 系统太复杂                 | 研发慢，测试难           | 每次新增内容都要担心牵一发动全身 | 只做四指标、三幕、一条人生主线，项目作为事件出现 |
| 剧情太说教                 | 失去游戏感               | 用户不愿分享                     | 让机制表达观点，少写训诫文本                     |
| 过度追热点工具名           | 短期好笑                 | 很快过时，且有品牌风险           | 使用虚构工具和通用原型，不直接消费真实品牌       |
| 传播功能过重               | 首屏慢、隐私疑虑         | 账号体系维护负担                 | 只做结果页可截图，不做账号和额外传播机制         |

## 第一版建议

第一阶段目标：验证“15 分钟内让目标用户笑、反思、愿意截图或转述”的核心命题。

范围：

- 一个浏览器页面。
- 一条人生主线：从第一次认真 Vibe Coding 到形成身份结局。
- 项目作为过程中出现的事件和作品记录，不作为唯一主角。
- 40-60 张事件卡。
- 4 个指标。
- 8-12 个身份结局。
- 本地存档。
- 结局页。
- 不接账号、不接支付、不接排行榜、不接实时大语言模型。

内容结构建议：

```ts
type Card = {
  id: string;
  phase: "start" | "noticed" | "identity";
  tags: string[];
  conditions?: Condition[];
  text: string;
  choices: Array<{
    label: string;
    effects: StatEffect[];
    immediateLine: string;
    delayedFlags?: string[];
  }>;
};
```

这不是最终代码方案，只是说明内容必须结构化。后续每张卡需要可测试：条件能否触发、指标是否越界、是否存在死局、结局是否可达。

## 下一步建议

1. 先确定一句话产品承诺：例如“一个关于你从今天开始 Vibe Coding，最终变成什么人的 15 分钟模拟器”。
2. 写 20 个核心人生节点，不写完整剧本。
3. 纸面或纯文本原型测试 5 个目标用户，观察他们是否会笑、是否能理解指标、是否愿意截图或转述结局。
4. 再进入技术实现：Web 前端 + 结构化事件引擎 + 本地结果页。

## 来源

- [Universal Paperclips](https://www.decisionproblem.com/paperclips/)
- [Frank Lantz: Universal Paperclips 4-6 hour description](https://www.franklantz.net/work)
- [Wired: Universal Paperclips and JavaScript origin](https://www.wired.com/story/the-way-the-world-ends-not-with-a-bang-but-a-paperclip/)
- [The Password Game](https://neal.fun/password-game/)
- [The Password Game App Store](https://apps.apple.com/us/app/the-password-game/id6455685163)
- [Stimulation Clicker](https://neal.fun/stimulation-clicker/)
- [Stimulation Clicker overview](https://en.wikipedia.org/wiki/Stimulation_Clicker)
- [Infinite Craft](https://neal.fun/infinite-craft/)
- [Infinite Craft App on Google Play](https://play.google.com/store/apps/details?hl=en-US&id=fun.neal.infinite.craft)
- [MobyGames: Infinite Craft LLaMA and First Discovery](https://www.mobygames.com/game/224278/infinite-craft/)
- [BitLife App Store](https://apps.apple.com/us/app/bitlife-life-simulator/id1374403536)
- [Devolver Digital: Reigns](https://www.devolverdigital.com/games/reigns)
- [The Founder](https://thefounder.biz/)
- [AlternativeTo: The Founder JavaScript/open source listing](https://alternativeto.net/software/the-founder/about/)
- [AI Dungeon App Store](https://apps.apple.com/us/app/ai-dungeon/id1491268416)
- [AI Dungeon memory system docs](https://help.aidungeon.com/faq/the-memory-system)
- [Twine](https://twinery.org/)
- [Ink](https://github.com/inkle/ink)
- [ChoiceScript](https://www.choiceofgames.com/make-your-own-games/choicescript-intro/)
- [Ren'Py](https://www.renpy.org/)
- [Phaser docs](https://docs.phaser.io/phaser/getting-started/what-is-phaser)
- [Godot](https://godotengine.org/)
- [Google Cloud: What is vibe coding](https://cloud.google.com/discover/what-is-vibe-coding?hl=en)
