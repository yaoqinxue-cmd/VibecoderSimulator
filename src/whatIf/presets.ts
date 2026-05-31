import type { WhatIfPreset } from "./types";

export const emptyWhatIfInput = {
  situation: "",
  decision: "",
  optionA: "",
  optionB: "",
  goal: "",
  fear: "",
};

export const whatIfPresets: WhatIfPreset[] = [
  {
    id: "product-pricing",
    label: "产品收费",
    input: {
      situation: "我有一个小工具，用户增长还可以，但运行成本越来越高。",
      decision: "继续免费冲规模，还是现在开始收费？",
      optionA: "继续免费",
      optionB: "小范围收费测试",
      goal: "验证这个产品能不能长期做下去",
      fear: "太早收费把用户吓走，太晚收费又被成本追着跑",
    },
  },
  {
    id: "team-refactor",
    label: "团队重构",
    input: {
      situation: "团队代码越来越乱，新功能越来越慢，大家都在说要重构。",
      decision: "要不要现在全面重构？",
      optionA: "全面重构",
      optionB: "局部整理",
      goal: "让交付速度恢复，同时不要拖垮业务节奏",
      fear: "重构拖太久，新功能也交不出来",
    },
  },
  {
    id: "creator-talk",
    label: "付费分享",
    input: {
      situation: "我做了一个还没完全稳定的小产品，有人邀请我做一场付费分享。",
      decision: "要不要接这个主题很大的分享？",
      optionA: "接下分享",
      optionB: "改成真实复盘",
      goal: "抓住机会，但不把还没发生的成功讲满",
      fear: "产品还没稳定，人设先跑远",
    },
  },
];
