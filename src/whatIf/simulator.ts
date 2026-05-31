import type { WhatIfBranch, WhatIfInput, WhatIfResult } from "./types";

const safetyKeywords = [
  "治疗",
  "诊断",
  "吃药",
  "药物",
  "医生",
  "手术",
  "起诉",
  "合同",
  "律师",
  "违法",
  "股票",
  "基金",
  "投资",
  "买入",
  "卖出",
  "自杀",
  "不想活",
  "伤害自己",
];

function hasText(value: string) {
  return value.trim().length > 0;
}

function field(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getPattern(input: WhatIfInput) {
  const text = Object.values(input).join(" ");

  if (includesAny(text, safetyKeywords)) {
    return "safety";
  }

  if (includesAny(text, ["重构", "代码", "团队", "交付", "功能"])) {
    return "team";
  }

  if (includesAny(text, ["收费", "免费", "用户", "成本", "增长", "产品"])) {
    return "product";
  }

  if (includesAny(text, ["分享", "课程", "内容", "人设", "曝光"])) {
    return "creator";
  }

  return "generic";
}

function makeSafetyResult(input: WhatIfInput): WhatIfResult {
  return {
    mode: "safety",
    title: "先把问题整理清楚",
    realDecisionPoint:
      "这个问题可能涉及专业判断或高风险后果，不适合被做成普通的未来分支游戏。更有用的做法，是先把事实、目标和要问的问题整理清楚。",
    riskReason:
      "Demo 不会替你判断治疗、法律、投资或即时安全问题，也不会给出确定性行动建议。",
    prepList: [
      {
        label: "你真正要弄清楚的事",
        items: [
          field(input.decision, "现在到底要做哪个不可逆选择"),
          field(input.goal, "你最想保护的结果和底线"),
        ],
      },
      {
        label: "还缺的事实",
        items: [
          "有哪些信息必须由专业人士或可靠来源确认",
          "每个选项的成本、风险、时间和不可逆程度",
        ],
      },
      {
        label: "低风险准备动作",
        items: [
          "把相关材料按时间顺序整理到一个文件夹",
          "写下你最想问专业人士的 3 个问题",
        ],
      },
    ],
    nextAction:
      "先花 20 分钟写一页事实清单，只写已经发生的事、还缺的信息和你最想问的问题。",
    resultCard: {
      label: "先开灯再行动",
      note: "这类问题不要靠气氛推进，先把房间里的东西看清楚。",
    },
  };
}

function makeProductBranches(input: WhatIfInput): WhatIfBranch[] {
  return [
    {
      label: "分支 A：继续冲规模",
      action: `选择${field(input.optionA, "继续扩大使用量")}，先让更多人进来。`,
      day7: "数据会更好看，反馈也会变多，你会感觉事情正在加速。",
      day30: "成本开始变成每天都会看的数字，热闹越多，心里越没底。",
      day90:
        "如果还没有付费信号，你可能分不清大家是真的需要，还是只是顺手试试。",
      hiddenCost:
        "免费会把好奇、喜欢和刚需混在一起，让真实需求晚一点才浮出来。",
      earlySignals: [
        "高频用户是否愿意留下联系方式",
        "成本增长是否快过有效使用增长",
      ],
      playerState: "短期更兴奋，长期容易被增长曲线牵着走。",
    },
    {
      label: "分支 B：小范围收费",
      action: `选择${field(input.optionB, "小范围收费测试")}，只邀请一小组高频用户试一试。`,
      day7: "你会紧张，因为增长数字没有继续冲，但反应会更真实。",
      day30: "愿意付费的人会说出更具体的需求，不愿意付费的人也会暴露薄弱点。",
      day90:
        "你会更清楚它是一个能长期做的工具，还是一个大家喜欢但不会付钱的小玩意。",
      hiddenCost: "收费测试会让一部分人离开，也会让你少一点被热闹保护的感觉。",
      earlySignals: [
        "被邀请用户是否在 48 小时内回复",
        "是否有人愿意为当前版本付一笔小钱",
      ],
      playerState: "短期不舒服，长期判断更清醒。",
    },
    {
      label: "分支 C：先缩小入口",
      action: "先限制最耗成本或最泛的用法，把产品收窄到一个更具体的人群。",
      day7: "增长可能变慢，但你会更容易看见谁是真的离不开它。",
      day30: "用户反馈会从“挺好玩”变成“这个环节帮了我”。",
      day90: "你可能得到一个更小但更结实的入口，再决定怎么定价。",
      hiddenCost: "收窄会损失一部分泛流量，也会让产品看起来没那么热闹。",
      earlySignals: ["收窄后留存是否变好", "用户是否能一句话说清它解决了什么"],
      playerState: "少一点被流量鼓舞，多一点被真实使用支撑。",
    },
  ];
}

function makeTeamBranches(input: WhatIfInput): WhatIfBranch[] {
  return [
    {
      label: "分支 A：全面重构",
      action: `选择${field(input.optionA, "全面重构")}，开一个大项目换掉旧结构。`,
      day7: "白板上会出现一个整洁的新世界，团队短期很有希望。",
      day30: "旧系统还在跑，新系统还没接上，需求排队的人开始敲门。",
      day90: "如果范围没控住，团队可能同时维护两个世界，交付反而更慢。",
      hiddenCost: "全面重构最容易低估迁移和兼容成本。",
      earlySignals: [
        "重构范围是否能一页纸说清",
        "每周是否都有可上线的迁移成果",
      ],
      playerState: "短期像重新出发，长期可能被两套系统夹住。",
    },
    {
      label: "分支 B：局部整理",
      action: `选择${field(input.optionB, "局部整理")}，先修最常导致延期和 bug 的一处边界。`,
      day7: "变化不够壮观，但团队能看到一个具体痛点被处理。",
      day30: "如果选对位置，重复 bug 会减少，新功能在这个区域变顺。",
      day90: "团队会形成节奏：做功能时顺手修掉最影响速度的那一段。",
      hiddenCost:
        "它没有史诗感，需要持续选择最痛的地方，而不是哪里不顺眼修哪里。",
      earlySignals: ["同一类 bug 是否减少", "这个模块的新需求评估是否更稳定"],
      playerState: "短期没那么燃，长期会多一点掌控感。",
    },
    {
      label: "分支 C：先记录疼点",
      action: "继续交付两周，但给每次延期、返工和线上问题打标签。",
      day7: "业务节奏不被打断，团队也不用马上进入重构争论。",
      day30: "你们会看到最浪费时间的不是“代码乱”，而是几个重复场景。",
      day90: "重构会从观点之争变成证据驱动的排期。",
      hiddenCost: "只记录不处理会变成新表格，所以必须提前约定怎么用证据决策。",
      earlySignals: [
        "两周内是否收集到重复延期原因",
        "业务方是否接受一个小修复窗口",
      ],
      playerState: "短期继续扛活，长期把抱怨变成谈判材料。",
    },
  ];
}

function makeCreatorBranches(input: WhatIfInput): WhatIfBranch[] {
  return [
    {
      label: "分支 A：接下大主题",
      action: `选择${field(input.optionA, "接下分享")}，把它包装成一次完整经验分享。`,
      day7: "邀请、海报和报名链接会让事情看起来已经成了。",
      day30: "听众开始追问具体做法，你需要把还不稳定的经验讲得像已经跑通。",
      day90: "如果产品没继续长出来，你会花力气维护一个比现实更快的形象。",
      hiddenCost: "主题越大，你越容易被迫回答还没验证过的问题。",
      earlySignals: ["听众问的是过程还是成功故事", "产品是否真的有连续使用者"],
      playerState: "短期像被推上舞台，长期可能一边做产品一边补人设作业。",
    },
    {
      label: "分支 B：改成真实复盘",
      action: `选择${field(input.optionB, "真实复盘")}，讲已经发生的事和还没跑通的地方。`,
      day7: "分享仍然推进，但你不用把半成品讲成竣工典礼。",
      day30: "你会吸引更懂现实难度的人，他们可能给出具体反馈。",
      day90: "如果产品继续进步，这次分享会变成连续记录的第一章。",
      hiddenCost:
        "真实复盘的传播性可能不如大标题，但留下的人更可能理解你在做什么。",
      earlySignals: [
        "邀请方是否接受更具体的标题",
        "分享后是否有人提出真实使用场景",
      ],
      playerState: "保住机会，也保住和现实对齐的速度。",
    },
    {
      label: "分支 C：先做小范围试讲",
      action: "先找 5 到 10 个目标听众试讲一版，只收问题，不卖结论。",
      day7: "你会很快知道大家想听什么，也知道哪些地方讲起来心虚。",
      day30: "主题会从宏大口号缩成更可信的经验片段。",
      day90: "你可能得到一个更扎实的系列，而不是一次容易透支的亮相。",
      hiddenCost: "试讲没有正式活动那么刺激，需要你能忍住提前宣布的冲动。",
      earlySignals: [
        "试讲后大家是否复述得出核心收获",
        "问题是否集中在同一个真实痛点",
      ],
      playerState: "少一点闪光灯，多一点可重复的证据。",
    },
  ];
}

function makeGenericBranches(input: WhatIfInput): WhatIfBranch[] {
  const optionA = field(input.optionA, "直接推进");
  const optionB = field(input.optionB, "先降低风险");

  return [
    {
      label: `分支 A：${optionA}`,
      action: `选择${optionA}，先把事情往前推。`,
      day7: "你会得到速度和确定感，也会更快碰到真实摩擦。",
      day30: "如果方向对，反馈会开始变具体；如果方向偏，代价也会变清楚。",
      day90: "这条路会把你推向更强承诺，也会减少回头重选的余地。",
      hiddenCost: "快进会省掉犹豫，也可能省掉必要的确认。",
      earlySignals: [
        "是否有人因为你的动作改变了自己的行为",
        "你是否开始为同一个问题反复补救",
      ],
      playerState: "短期更有推进感，长期更考验承压能力。",
    },
    {
      label: `分支 B：${optionB}`,
      action: `选择${optionB}，先保护可逆性和基本盘。`,
      day7: "压力会小一点，但你可能会担心自己是不是太保守。",
      day30: "你会保留更多选择权，也会更慢拿到外部反馈。",
      day90:
        "如果你持续观察信号，这条路会更稳；如果只是拖延，它会变成原地打转。",
      hiddenCost: "保守不是免费午餐，它会消耗机会窗口和自己的耐心。",
      earlySignals: ["是否真的产生了新信息", "你是否只是换一种方式推迟决定"],
      playerState: "短期更稳，长期需要主动制造反馈。",
    },
    {
      label: "分支 C：做一个小实验",
      action: "把选择缩成一个 48 小时内能完成的小测试。",
      day7: "你不会立刻押上全部，但会得到第一批真实反应。",
      day30: "如果实验有效，你会知道该放大哪一部分。",
      day90: "你可能走出一条比 A/B 都更细、更贴近现实的路线。",
      hiddenCost: "小实验需要设计得足够具体，否则只是把决定换个名字。",
      earlySignals: [
        "实验是否能让别人做出真实选择",
        "结果是否改变了你原来的判断",
      ],
      playerState: "少一点豪赌感，多一点主动侦察感。",
    },
  ];
}

function makeBranches(input: WhatIfInput): WhatIfBranch[] {
  const pattern = getPattern(input);

  if (pattern === "product") {
    return makeProductBranches(input);
  }

  if (pattern === "team") {
    return makeTeamBranches(input);
  }

  if (pattern === "creator") {
    return makeCreatorBranches(input);
  }

  return makeGenericBranches(input);
}

export function simulateWhatIf(input: WhatIfInput): WhatIfResult {
  const pattern = getPattern(input);

  if (pattern === "safety") {
    return makeSafetyResult(input);
  }

  const branches = makeBranches(input);
  const optionA = field(input.optionA, "直接推进");
  const optionB = field(input.optionB, "降低风险");
  const goal = field(input.goal, "得到更清楚的现实反馈");
  const fear = field(input.fear, "走错路之后才发现代价");

  return {
    mode: "branches",
    title: "未来分支已生成",
    realDecisionPoint: `你不是只在选“${optionA}”还是“${optionB}”，你是在选：现在优先靠近${goal}，还是先处理${fear}这件事。`,
    branches,
    warningSignals: [
      "你开始反复解释自己的选择，但现实反馈没有变多。",
      "每条路听起来都对，却没有任何一个动作能在 72 小时内完成。",
      "你只在看支持自己原判断的信号。",
      "最害怕的代价已经出现苗头，但你把它当成暂时现象。",
    ],
    nextAction: hasText(input.decision)
      ? `在 48 小时内做一个小测试，只验证这件事：${input.decision.trim()}背后最关键的一个假设是否成立。`
      : "在 48 小时内做一个小测试，只验证当前选择里最关键、最容易被现实回答的一个假设。",
    resultCard: {
      label: "先试玩未来",
      note: "不用立刻赌上一整条人生线，先让现实回你一小句。",
    },
  };
}
