import { addPageBase, palette } from "./common.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "小程序界面展示",
    kicker: "UI Showcase",
    page: 6,
  });

  const phones = [
    { left: 84, title: "分类浏览", subtitle: "检索 + 分类筛选", body1: "高等数学教材转赠", body2: "求高数复习资料" },
    { left: 394, title: "发布信息", subtitle: "图片上传 + AI 辅助", body1: "上传图片", body2: "填写描述 / 联系方式 / 交接地点" },
    { left: 704, title: "我的", subtitle: "匹配记录 + 信誉积分", body1: "已发布资源：1", body2: "信誉积分：100" },
  ];

  for (const phone of phones) {
    ctx.addShape(slide, {
      left: phone.left,
      top: 170,
      width: 220,
      height: 430,
      fill: "#1F1F1F",
      line: ctx.line("#111111", 1),
      radius: 32,
    });
    ctx.addShape(slide, {
      left: phone.left + 8,
      top: 178,
      width: 204,
      height: 414,
      fill: "#F5F7EF",
      line: ctx.line("#F5F7EF", 0),
      radius: 28,
    });
    ctx.addShape(slide, {
      left: phone.left + 8,
      top: 178,
      width: 204,
      height: 42,
      fill: "#4E8763",
      line: ctx.line("#4E8763", 0),
      radius: 28,
    });
    ctx.addShape(slide, {
      left: phone.left + 72,
      top: 184,
      width: 76,
      height: 16,
      fill: "#101010",
      line: ctx.line("#101010", 0),
      geometry: "roundRect",
    });
    ctx.addText(slide, {
      text: phone.title,
      left: phone.left + 58,
      top: 205,
      width: 100,
      height: 16,
      fontSize: 11,
      color: "#FFFFFF",
      bold: true,
      align: "center",
    });
    ctx.addShape(slide, {
      left: phone.left + 16,
      top: 238,
      width: 172,
      height: 56,
      fill: "#86AF74",
      line: ctx.line("#86AF74", 0),
      radius: 18,
    });
    ctx.addText(slide, {
      text: phone.subtitle,
      left: phone.left + 28,
      top: 258,
      width: 146,
      height: 18,
      fontSize: 13,
      bold: true,
      color: "#FFFFFF",
      align: "center",
    });
    ctx.addShape(slide, {
      left: phone.left + 16,
      top: 314,
      width: 172,
      height: 42,
      fill: "#FFFDF7",
      line: ctx.line("#EAEDE3", 1),
      radius: 14,
    });
    ctx.addText(slide, {
      text: phone.body1,
      left: phone.left + 28,
      top: 329,
      width: 146,
      height: 18,
      fontSize: 12,
      color: palette.ink,
      bold: true,
      align: "center",
    });
    ctx.addShape(slide, {
      left: phone.left + 16,
      top: 370,
      width: 172,
      height: 64,
      fill: "#FFFDF7",
      line: ctx.line("#EAEDE3", 1),
      radius: 14,
    });
    ctx.addText(slide, {
      text: phone.body2,
      left: phone.left + 26,
      top: 392,
      width: 152,
      height: 24,
      fontSize: 11,
      color: palette.muted,
      align: "center",
    });
    ctx.addShape(slide, {
      left: phone.left + 8,
      top: 560,
      width: 204,
      height: 32,
      fill: "#FFFDF7",
      line: ctx.line("#FFFDF7", 0),
      radius: 18,
    });
    ctx.addText(slide, {
      text: "首页        分类        发布        我的",
      left: phone.left + 24,
      top: 572,
      width: 170,
      height: 14,
      fontSize: 10,
      color: "#8A8A72",
      align: "center",
    });
  }

  ctx.addShape(slide, {
    left: 1024,
    top: 170,
    width: 184,
    height: 430,
    fill: "#FFFFFF",
    line: ctx.line(palette.line, 1),
  });
  ctx.addText(slide, {
    text: "界面特征总结",
    left: 1048,
    top: 198,
    width: 120,
    height: 22,
    fontSize: 17,
    bold: true,
    color: palette.green,
  });
  const notes = [
    "整体视觉采用浅米白背景 + 校园绿色主色",
    "卡片化布局清晰，适合移动端信息浏览",
    "发布页强调图片上传和低门槛录入",
    "“我的”页面集中展示匹配记录与信誉积分",
    "界面风格与项目“公益、轻量、可信”定位一致",
  ];
  let top = 236;
  for (const note of notes) {
    ctx.addShape(slide, {
      left: 1048,
      top: top + 6,
      width: 7,
      height: 7,
      fill: palette.green,
      line: ctx.line(palette.green, 0),
      geometry: "ellipse",
    });
    ctx.addText(slide, {
      text: note,
      left: 1064,
      top,
      width: 120,
      height: 42,
      fontSize: 13,
      color: palette.ink,
    });
    top += 58;
  }
  return slide;
}
