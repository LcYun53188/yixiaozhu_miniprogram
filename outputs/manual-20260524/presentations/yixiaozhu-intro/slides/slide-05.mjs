import { addMiniTag, addPageBase, palette } from "./common.mjs";

function node(ctx, slide, left, top, title, body, fill = "#FFFFFF") {
  ctx.addShape(slide, {
    left,
    top,
    width: 204,
    height: 112,
    fill,
    line: ctx.line(palette.line, 1),
  });
  ctx.addText(slide, {
    text: title,
    left: left + 18,
    top: top + 16,
    width: 164,
    height: 24,
    fontSize: 17,
    bold: true,
    color: palette.ink,
  });
  ctx.addText(slide, {
    text: body,
    left: left + 18,
    top: top + 48,
    width: 170,
    height: 46,
    fontSize: 13,
    color: palette.muted,
  });
}

function arrow(ctx, slide, left, top, width = 64) {
  ctx.addShape(slide, {
    left,
    top,
    width,
    height: 4,
    fill: palette.green,
    line: ctx.line(palette.green, 0),
  });
  ctx.addShape(slide, {
    left: left + width - 12,
    top: top - 6,
    width: 16,
    height: 16,
    fill: palette.green,
    line: ctx.line(palette.green, 0),
    geometry: "chevron",
  });
}

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "产品设计与业务闭环",
    kicker: "Product Flow",
    page: 5,
  });

  ctx.addText(slide, {
    text: "平台以“发布、审核、匹配、对接、评价、信誉沉淀”为主线，把原本零散的互助信息流程化、可管理化。",
    left: 72,
    top: 150,
    width: 1120,
    height: 34,
    fontSize: 20,
    color: palette.ink,
  });

  const startLeft = 74;
  const top = 244;
  node(ctx, slide, startLeft, top, "发布信息", "资源/需求表单\n图片上传\n用户评估价", "#FFFFFF");
  arrow(ctx, slide, 286, 298);
  node(ctx, slide, 350, top, "AI 辅助", "分类识别\n标签提取\n文案优化", "#F9FBF7");
  arrow(ctx, slide, 562, 298);
  node(ctx, slide, 626, top, "管理员审核", "过滤广告与低质量内容\n保证平台可信度", "#FFFFFF");
  arrow(ctx, slide, 838, 298);
  node(ctx, slide, 902, top, "智能匹配", "匹配分数\n推荐原因\n状态推进", "#F9FBF7");
  arrow(ctx, slide, 1114, 298, 44);
  node(ctx, slide, 1158, top, "完成评价", "星级评价\n文字评价\n信誉积分", "#FFFFFF");

  addMiniTag(ctx, slide, { text: "图片上传", left: 102, top: 418, width: 102 });
  addMiniTag(ctx, slide, { text: "用户评估价", left: 218, top: 418, width: 118 });
  addMiniTag(ctx, slide, { text: "AI 标签", left: 404, top: 418, width: 94 });
  addMiniTag(ctx, slide, { text: "风险识别", left: 680, top: 418, width: 94 });
  addMiniTag(ctx, slide, { text: "匹配原因", left: 956, top: 418, width: 94 });
  addMiniTag(ctx, slide, { text: "信誉积分", left: 1176, top: 418, width: 94 });

  ctx.addShape(slide, {
    left: 72,
    top: 492,
    width: 1120,
    height: 118,
    fill: palette.greenSoft,
    line: ctx.line(palette.line, 1),
  });
  ctx.addText(slide, {
    text: "设计重点",
    left: 96,
    top: 516,
    width: 120,
    height: 24,
    fontSize: 18,
    bold: true,
    color: palette.greenDark,
  });
  ctx.addText(slide, {
    text: "产品设计并不追求复杂功能堆叠，而是优先保证业务闭环清晰。通过把图片、评估价、AI 辅助、审核治理和信誉机制串成一个完整路径，项目既更适合比赛展示，也更具后续落地空间。",
    left: 96,
    top: 550,
    width: 1048,
    height: 40,
    fontSize: 16,
    color: palette.ink,
  });
  return slide;
}
