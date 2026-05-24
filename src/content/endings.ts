import type { Ending } from "../game/types";

export const endings: Ending[] = [
  {
    id: "boring-ok",
    label: "无聊但OK",
    shortNote: "没爆火，但你活得像个下个月还能继续的人类。",
    stateLine: "你的东西稳定运行，用户默默续费，而你睡得很好。",
    description:
      "你的结局没有烟花，没有发布会，也没有一句“我重构了人生”。但周一早上，系统还在跑，用户还在用，你也没有一边补 bug 一边补觉。",
    keyChoices: [
      "拒绝把第一版做成平台。",
      "把完整版本改成下周能用的一件事。",
      "在半夜关掉了电脑。",
    ],
    conditions: [],
    priority: 1,
  },
  {
    id: "real-users",
    label: "真有人在用！",
    shortNote:
      "真的做出了很牛逼的产品，代价是开始认真写清楚“做到什么才算完成”。",
    stateLine: "你真的做出了一个有人需要、有人付费、你也能维护的东西。",
    description:
      "你既敢让 AI 先跑出一版，也愿意逐页点开、逐个流程试。你没有把第一个能跑的版本当成神迹，而是把它当成一块可以继续雕刻的材料。",
    keyChoices: [
      "没有把第一个演示版本当终点。",
      "把用户夸奖和用户痛点分开处理。",
      "在最想加功能的时候选择删功能。",
    ],
    conditions: [
      { type: "statGte", stat: "momentum", value: 58 },
      { type: "statGte", stat: "judgment", value: 64 },
      { type: "statGte", stat: "stability", value: 44 },
      { type: "hasFlag", flag: "paid-users" },
    ],
    priority: 40,
  },
  {
    id: "intent-deconstructor",
    label: "复杂意图解构师",
    shortNote: "没有变成大师，但学会了不把模糊当灵感。",
    stateLine: "你没有做最多的东西，但你能把复杂意图讲清楚。",
    description:
      "你不急着让 AI 开工，因为你见过太多“先做起来再说”最后变成谁都不敢动的半成品。浪漫少了一点，但返工少了很多。",
    keyChoices: [
      "把万能提示词拆成目标、限制和验收。",
      "让 AI 解释到自己能复述。",
      "区分想要的结果和想听到的回答。",
    ],
    conditions: [
      { type: "statGte", stat: "judgment", value: 72 },
      { type: "statGte", stat: "agency", value: 62 },
    ],
    priority: 38,
  },
  {
    id: "automation-addict",
    label: "自动化上瘾者",
    shortNote: "你的工具链已经开始对你进行绩效管理。",
    stateLine: "你自动化了工作、生活、提醒、回顾和休息。",
    description:
      "你一开始只是想少点重复劳动，后来连“少点重复劳动”这件事也被你做成了自动化流程。唯一的问题是，你本人越来越像系统的外包操作员。",
    keyChoices: [
      "让 AI 助手给另一个 AI 助手分配任务。",
      "把真实反馈交给系统自动归类。",
      "把睡觉也做成了一个待办流。",
    ],
    conditions: [
      { type: "hasFlag", flag: "auto-everything" },
      { type: "statLte", stat: "agency", value: 42 },
    ],
    priority: 35,
  },
  {
    id: "demo-king",
    label: "录屏演示之王",
    shortNote: "只要不点开产品，一切都很完美。",
    stateLine: "你的录屏永远丝滑，现场总会出状况。",
    description:
      "你很会把一堆还没修完的东西，剪成 42 秒像未来一样的高清视频。观众很想转发，用户很想找客服，产品还差一次真正的现场测试。",
    keyChoices: [
      "核心逻辑看不懂时继续做界面。",
      "把用户质疑当成传播素材。",
      "发布前一天新增了三种动画。",
    ],
    conditions: [
      { type: "hasFlag", flag: "demo-first" },
      { type: "statLte", stat: "judgment", value: 48 },
    ],
    priority: 34,
  },
  {
    id: "success-persona",
    label: "成功人设",
    shortNote: "产品一般，但标题真的很懂增长。",
    stateLine: "产品还没稳定，但你的方法论已经三期连载。",
    description:
      "你很会把混乱讲成方法，把踩坑讲成路径。你不是没有做东西，只是你的第一个爆款不是产品，而是“正在成功的你”。",
    keyChoices: [
      "把第一次收入截图放大了三次。",
      "用时代机会解释所有边界问题。",
      "开始按人设做决定。",
    ],
    conditions: [{ type: "hasFlag", flag: "public-methodology" }],
    priority: 33,
  },
  {
    id: "bill-chased",
    label: "被账单追杀",
    shortNote: "用户越喜欢，你越紧张。",
    stateLine: "你的产品增长很快，账单增长更快。",
    description:
      "你终于拥有了用户，而且他们真的在用。每多一个活跃用户，你都要重新打开一次成本表。需求证明了，商业模式还在补作业。",
    keyChoices: [
      "把 API 账单当成增长的副作用。",
      "在第一笔收入后宣布商业验证完成。",
      "没有区分试用热情和长期需求。",
    ],
    conditions: [
      { type: "hasFlag", flag: "cost-ignored" },
      { type: "statLte", stat: "stability", value: 42 },
    ],
    priority: 36,
  },
  {
    id: "quiet-validation",
    label: "闷声做完验证",
    shortNote: "没赢热搜，但赢了下个月还能继续。",
    stateLine: "几个月后，你留下了一个能用的东西和一个还算完整的人。",
    description:
      "你没有每次新工具一发布就搬家，也没有把每个灵感都发成公开承诺。你的节奏不吵，但地上有脚印；你的进展不炸裂，但真的往前走了。",
    keyChoices: [
      "新工具发布时没有立刻迁移。",
      "把模糊需求变成可验证目标。",
      "在深夜选择关机。",
    ],
    conditions: [
      { type: "hasFlag", flag: "quiet-validation" },
      { type: "statGte", stat: "judgment", value: 62 },
    ],
    priority: 37,
  },
  {
    id: "prompt-nesting",
    label: "指令套娃get",
    shortNote: "人生进入了自动驾驶，但目的地是自动生成的。",
    stateLine: "你搭建了一个由 AI 管理 AI、评价 AI、安慰 AI 的系统。",
    description:
      "屏幕上热闹得像开会，只有你偶尔想起：最开始我要做什么来着？你没有失控，你只是被流程礼貌地请到了旁听席。",
    keyChoices: [
      "让第三个 AI 总结前两个 AI 的分歧。",
      "接受了系统生成的人生目标。",
      "分不清哪个需求最初来自自己。",
    ],
    conditions: [
      { type: "hasFlag", flag: "ai-managers" },
      { type: "statLte", stat: "agency", value: 40 },
    ],
    priority: 39,
  },
  {
    id: "body-offline",
    label: "肉体即将下线",
    shortNote: "产品快上线了，你也快下线了。",
    stateLine: "你跑得很快，快到把睡眠、朋友、身体和耐心都留在了上一个版本。",
    description:
      "你不是不适合创造，你只是连续太久把自己当成不用维护的服务器。现在最该上线的功能，是你自己的强制休眠。",
    keyChoices: [
      "接下所有模糊任务证明自己进化。",
      "用窗口期解释所有透支。",
      "把焦虑误认为使命感。",
    ],
    conditions: [{ type: "statLte", stat: "stability", value: 30 }],
    priority: 42,
  },
  {
    id: "tool-collector",
    label: "工具收藏家",
    shortNote: "你的生产力系统终于需要一个生产力系统。",
    stateLine: "你没有做出完整产品，但拥有全网最完整的 AI 工具对比表。",
    description:
      "每个新工具发布，你都能在五分钟内打开官网、收藏教程、建一个测试项目。真正的用户功能还没上车，但工具栈截图已经很有说服力。",
    keyChoices: [
      "每次新工具发布都立刻迁移。",
      "用基础设施解释三天没有做用户功能。",
      "项目有 41 个环境变量，但没有真实用户。",
    ],
    conditions: [{ type: "hasFlag", flag: "tool-migration" }],
    priority: 32,
  },
  {
    id: "boss-me",
    label: "老板竟是我",
    shortNote: "你做成了产品，然后产品开始安排你的人生。",
    stateLine:
      "你本来只是想做个小工具，结果用户、账单、客服和合作邀约同时敲门。",
    description:
      "你不是失败了，你是成功得有点突然。最难的不是继续写代码，而是承认：这东西已经不是周末玩具了，它开始占用你的日历了。",
    keyChoices: [
      "抓住了真实需求。",
      "太早答应了企业版。",
      "把“我先手动处理一下”说了 49 次。",
    ],
    conditions: [
      { type: "hasFlag", flag: "paid-users" },
      { type: "hasFlag", flag: "enterprise-promised" },
    ],
    priority: 41,
  },
];
