import { addCard, addPageBase, palette } from "./common.mjs";

function stackBox(ctx, slide, { left, top, width, height, title, items, fill, accent }) {
  ctx.addShape(slide, {
    left,
    top,
    width,
    height,
    fill,
    line: ctx.line(palette.line, 1),
  });
  ctx.addShape(slide, {
    left,
    top,
    width,
    height: 30,
    fill: accent,
    line: ctx.line(accent, 0),
  });
  ctx.addText(slide, {
    text: title,
    left: left + 16,
    top: top + 6,
    width: width - 32,
    height: 18,
    fontSize: 15,
    bold: true,
    color: "#FFFFFF",
  });
  let currentTop = top + 44;
  for (const item of items) {
    ctx.addShape(slide, {
      left: left + 18,
      top: currentTop + 5,
      width: 8,
      height: 8,
      fill: accent,
      line: ctx.line(accent, 0),
      geometry: "ellipse",
    });
    ctx.addText(slide, {
      text: item,
      left: left + 34,
      top: currentTop,
      width: width - 46,
      height: 24,
      fontSize: 13,
      color: palette.ink,
    });
    currentTop += 30;
  }
}

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "功能亮点与竞赛差异化",
    kicker: "Highlights",
    page: 7,
  });

  addCard(ctx, slide, {
    left: 72,
    top: 180,
    width: 340,
    height: 152,
    title: "图片上传与展示",
    body: "发布页支持最多 3 张图片选择、预览与删除，详情页支持图片回显与大图预览，增强资源信息真实性。",
  });
  addCard(ctx, slide, {
    left: 470,
    top: 180,
    width: 340,
    height: 152,
    title: "用户评估价",
    body: "为资源或需求提供价值参考字段，帮助双方更高效理解资源情况，降低沟通成本。",
    fill: "#F9FBF7",
    accent: palette.gold,
  });
  addCard(ctx, slide, {
    left: 868,
    top: 180,
    width: 340,
    height: 152,
    title: "AI 全流程赋能",
    body: "AI 不只是问答展示，而是直接用于分类、标签、文案优化、风险识别和匹配解释。",
    accent: palette.blue,
  });

  addCard(ctx, slide, {
    left: 72,
    top: 374,
    width: 540,
    height: 168,
    title: "评价与信誉积分机制",
    body: "完成对接后支持星级评价、文字评价和标签评价，并根据结果更新信誉积分。平台从单次信息发布升级为可持续信用沉淀系统。",
    accent: palette.greenDark,
  });
  addCard(ctx, slide, {
    left: 668,
    top: 374,
    width: 540,
    height: 168,
    title: "区别于普通发布平台",
    body: "益小助解决的不只是“信息能否发出来”，更重点解决“信息是否清晰、是否可信、是否容易匹配、是否能形成对接闭环”。这也是项目在比赛中的核心差异化。",
    fill: "#FFFFFF",
    accent: palette.gold,
  });
  ctx.addText(slide, {
    text: "项目亮点总结：把真实校园互助需求、移动端轻量体验、可感知的 UI 表现和 AI 实用能力结合成了一个可讲、可演示、可扩展的完整故事。",
    left: 72,
    top: 584,
    width: 1120,
    height: 34,
    fontSize: 18,
    color: palette.ink,
    bold: true,
  });
  return slide;
}
