import { addCard, addPageBase, palette } from "./common.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "当前成果、项目价值与后续规划",
    kicker: "Outcome & Roadmap",
    page: 9,
  });

  addCard(ctx, slide, {
    left: 72,
    top: 176,
    width: 340,
    height: 170,
    title: "当前成果",
    body: "已完成作品介绍文档、项目书、开发细节文档、前后端项目骨架、数据库脚本和 Word 版参赛材料。",
  });
  addCard(ctx, slide, {
    left: 470,
    top: 176,
    width: 340,
    height: 170,
    title: "项目价值",
    body: "提升校园闲置资源利用率，降低公益资源获取门槛，增强学生互助氛围，并验证 AI 在真实校园服务场景中的应用价值。",
    fill: "#F9FBF7",
    accent: palette.gold,
  });
  addCard(ctx, slide, {
    left: 868,
    top: 176,
    width: 340,
    height: 170,
    title: "后续规划",
    body: "继续接入真实对象存储与 AI 服务，补充地图交接点、公益活动报名、数据分析与用户画像推荐等能力。",
    accent: palette.blue,
  });

  ctx.addShape(slide, {
    left: 72,
    top: 398,
    width: 1136,
    height: 176,
    fill: palette.green,
    line: ctx.line(palette.green, 0),
  });
  ctx.addText(slide, {
    text: "答辩总结",
    left: 102,
    top: 430,
    width: 140,
    height: 26,
    fontSize: 20,
    bold: true,
    color: "#FFFDF7",
  });
  ctx.addText(slide, {
    text: "益小助以校园真实需求为基础，以微信小程序为载体，以 AI 为能力增益，围绕资源流转构建了完整业务闭环，兼具清晰展示价值与后续落地扩展空间。",
    left: 102,
    top: 472,
    width: 1000,
    height: 54,
    fontSize: 18,
    color: "#F8FCFA",
  });
  ctx.addText(slide, {
    text: "项目地址：github.com/LcYun53188/yixiaozhu_miniprogram",
    left: 102,
    top: 548,
    width: 540,
    height: 22,
    fontSize: 14,
    color: "#E7F6EE",
  });
  return slide;
}
