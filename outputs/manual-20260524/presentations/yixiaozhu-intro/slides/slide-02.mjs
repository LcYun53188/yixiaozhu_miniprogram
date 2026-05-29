import { addBulletList, addCard, addPageBase, palette } from "./common.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "项目定位与核心主张",
    kicker: "Project Positioning",
    page: 2,
  });

  ctx.addText(slide, {
    text: "益小助不是单纯的信息发布页，而是一个兼顾信息质量、匹配效率和平台信任机制的校园公益互助系统。",
    left: 72,
    top: 144,
    width: 1130,
    height: 44,
    fontSize: 22,
    color: palette.ink,
    bold: true,
  });

  addBulletList(ctx, slide, {
    left: 78,
    top: 222,
    width: 500,
    fontSize: 18,
    items: [
      "服务对象覆盖在校学生、学生组织、志愿服务团队与审核管理人员",
      "围绕“发布、审核、匹配、对接、评价、信誉沉淀”构建完整闭环",
      "以微信小程序作为轻量入口，以 AI 作为信息处理增强模块",
    ],
  });

  addCard(ctx, slide, {
    left: 706,
    top: 222,
    width: 450,
    height: 118,
    title: "核心价值",
    body: "集中校园公益信息、提升信息表达质量、增强供需匹配效率，并通过审核与信誉机制建立长期可持续的信任体系。",
  });
  addCard(ctx, slide, {
    left: 706,
    top: 364,
    width: 450,
    height: 118,
    title: "比赛亮点",
    body: "图片上传、用户评估价、AI 标签和文案优化、评价与信誉积分都已进入当前项目口径，展示内容完整且可落地。",
    fill: "#F9FBF7",
    accent: palette.gold,
  });
  addCard(ctx, slide, {
    left: 706,
    top: 506,
    width: 450,
    height: 118,
    title: "答辩一句话概括",
    body: "让校园里的闲置资源和真实需求，通过 AI 和移动端服务，更快、更准、更可信地完成连接。",
    fill: "#FFFFFF",
    accent: palette.greenDark,
  });

  return slide;
}
