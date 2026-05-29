import { addCard, addPageBase, palette } from "./common.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "应用场景与用户价值",
    kicker: "Use Cases",
    page: 4,
  });

  const cards = [
    ["旧书教材转赠", "上传教材图片、课程类别、适用对象和用户评估价，帮助低年级学生快速获取真实可用的学习资源。"],
    ["闲置物资共享", "围绕台灯、衣物、文具、小家电等物资进行统一展示，减少资源闲置和重复购买。"],
    ["失物招领", "通过图片、分类和关键词集中管理失物信息，提高拾获方与失主之间的连接效率。"],
    ["爱心帮扶求助", "对时间敏感、资源紧缺的需求进行优先推荐，增强校园中的临时互助能力。"],
  ];

  let left = 72;
  let top = 182;
  for (let i = 0; i < cards.length; i += 1) {
    addCard(ctx, slide, {
      left,
      top,
      width: 540,
      height: 144,
      title: cards[i][0],
      body: cards[i][1],
      fill: i % 2 === 0 ? "#FFFFFF" : "#F9FBF7",
      accent: i % 2 === 0 ? palette.green : palette.gold,
    });
    if (left === 72) {
      left = 668;
    } else {
      left = 72;
      top += 168;
    }
  }

  ctx.addText(slide, {
    text: "场景共同特点：资源真实存在、需求清晰高频、对接需要时效、平台需要信任机制",
    left: 72,
    top: 556,
    width: 1120,
    height: 30,
    fontSize: 18,
    color: palette.greenDark,
    bold: true,
  });

  ctx.addShape(slide, {
    left: 72,
    top: 604,
    width: 1120,
    height: 36,
    fill: palette.greenSoft,
    line: ctx.line(palette.greenSoft, 0),
  });
  ctx.addText(slide, {
    text: "这些场景说明项目不仅适合做比赛展示，也具备进一步落地成真实校园服务工具的空间。",
    left: 92,
    top: 612,
    width: 1080,
    height: 20,
    fontSize: 16,
    color: palette.ink,
  });
  return slide;
}
