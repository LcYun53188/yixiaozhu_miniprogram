import { addCard, addPageBase, palette } from "./common.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "创作背景与痛点分析",
    kicker: "Background & Pain Points",
    page: 3,
  });

  ctx.addText(slide, {
    text: "校园公益资源长期存在，但信息传播方式零散、表达不完整、对接效率低、信任机制薄弱。",
    left: 72,
    top: 146,
    width: 1120,
    height: 38,
    fontSize: 21,
    bold: true,
    color: palette.ink,
  });

  addCard(ctx, slide, {
    left: 72,
    top: 220,
    width: 540,
    height: 128,
    title: "创作背景",
    body: "班级群、社团群、朋友圈和线下公告栏仍是校园公益资源流转的主要渠道，但这类方式难以沉淀信息，也缺乏统一规则和治理机制。",
  });
  addCard(ctx, slide, {
    left: 668,
    top: 220,
    width: 540,
    height: 128,
    title: "为什么引入 AI",
    body: "文本分类、标签提取、语义匹配与风险识别能力已经成熟，可以显著提升资源信息整理效率、审核效率和供需推荐质量。",
    accent: palette.gold,
  });

  const painCards = [
    ["信息传播碎片化", "资源分散在多个群和线下通知中，容易沉底，真正需要的人未必能及时看到。"],
    ["信息质量参差不齐", "缺少分类、图片、标签和参考说明，导致资源是否值得联系难以判断。"],
    ["匹配主要依赖人工", "用户需要自己逐条筛选，大量时间消耗在找信息而不是完成对接。"],
    ["平台信任难沉淀", "缺乏审核、评价和信誉体系，平台内容质量和用户信任难以长期维持。"],
  ];
  let left = 72;
  let top = 386;
  for (let index = 0; index < painCards.length; index += 1) {
    const [title, body] = painCards[index];
    addCard(ctx, slide, {
      left,
      top,
      width: 540,
      height: 104,
      title,
      body,
      fill: "#FFFFFF",
      accent: index % 2 === 0 ? palette.green : palette.blue,
    });
    if (left === 72) {
      left = 668;
    } else {
      left = 72;
      top += 122;
    }
  }

  return slide;
}
