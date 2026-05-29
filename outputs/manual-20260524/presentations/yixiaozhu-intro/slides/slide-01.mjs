import { palette } from "./common.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  slide.background.fill = palette.paper;

  ctx.addShape(slide, {
    left: 0,
    top: 0,
    width: ctx.W,
    height: ctx.H,
    fill: palette.paper,
    line: ctx.line(palette.paper, 0),
  });
  ctx.addShape(slide, {
    left: 0,
    top: 0,
    width: 1280,
    height: 250,
    fill: palette.green,
    line: ctx.line(palette.green, 0),
  });
  ctx.addShape(slide, {
    left: 880,
    top: 78,
    width: 280,
    height: 280,
    fill: palette.gold,
    line: ctx.line(palette.gold, 0),
    geometry: "ellipse",
  });
  ctx.addShape(slide, {
    left: 940,
    top: 108,
    width: 220,
    height: 220,
    fill: palette.mint,
    line: ctx.line(palette.mint, 0),
    geometry: "ellipse",
  });

  ctx.addText(slide, {
    text: "作品介绍 PPT",
    left: 78,
    top: 82,
    width: 240,
    height: 24,
    fontSize: 16,
    color: "#E9F7EF",
    bold: true,
  });
  ctx.addText(slide, {
    text: "益小助",
    left: 78,
    top: 126,
    width: 520,
    height: 64,
    fontSize: 34,
    color: "#FFFDF7",
    bold: true,
    face: ctx.fonts.title,
  });
  ctx.addText(slide, {
    text: "基于 AI 的校园公益资源智能匹配小程序",
    left: 78,
    top: 194,
    width: 620,
    height: 30,
    fontSize: 18,
    color: "#F6FBF8",
  });

  ctx.addText(slide, {
    text: "让闲置资源更快遇见真正需要的人",
    left: 78,
    top: 304,
    width: 460,
    height: 42,
    fontSize: 24,
    color: palette.ink,
    bold: true,
  });

  const points = [
    "聚焦旧书教材、闲置物资、失物招领、爱心帮扶等真实校园场景",
    "融合 AI 分类、标签提取、文案优化、风险识别与智能匹配",
    "支持图片上传、用户评估价、对接评价与信誉积分闭环",
  ];
  let top = 370;
  for (const point of points) {
    ctx.addShape(slide, {
      left: 84,
      top: top + 8,
      width: 10,
      height: 10,
      fill: palette.green,
      line: ctx.line(palette.green, 0),
      geometry: "ellipse",
    });
    ctx.addText(slide, {
      text: point,
      left: 108,
      top,
      width: 660,
      height: 38,
      fontSize: 18,
      color: palette.ink,
    });
    top += 52;
  }

  ctx.addShape(slide, {
    left: 774,
    top: 390,
    width: 408,
    height: 188,
    fill: "#FFFFFF",
    line: ctx.line(palette.line, 1),
  });
  ctx.addText(slide, {
    text: "项目链接",
    left: 848,
    top: 420,
    width: 120,
    height: 24,
    fontSize: 16,
    bold: true,
    color: palette.green,
  });
  ctx.addText(slide, {
    text: "github.com/LcYun53188/\nyixiaozhu_miniprogram",
    left: 804,
    top: 458,
    width: 340,
    height: 58,
    fontSize: 15,
    color: palette.ink,
  });
  ctx.addText(slide, {
    text: "2026 年辽宁省大学生移动应用开发大赛校级选拔赛",
    left: 78,
    top: 646,
    width: 760,
    height: 24,
    fontSize: 11,
    color: palette.muted,
  });
  return slide;
}
