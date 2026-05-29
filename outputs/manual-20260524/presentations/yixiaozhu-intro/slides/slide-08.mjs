import { addCard, addPageBase, palette } from "./common.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  addPageBase(ctx, slide, {
    title: "技术实现方案",
    kicker: "Technical Architecture",
    page: 8,
  });

  const cols = [
    ["表现层", "微信小程序前端\n页面展示、表单交互\n图片选择与状态反馈", palette.green],
    ["业务层", "Node.js + Express\n接口实现、审核逻辑\n匹配逻辑与消息通知", palette.blue],
    ["数据层", "MySQL\n用户、资源、需求、评价\n等核心数据持久化", palette.gold],
    ["AI 能力层", "第三方大模型 API\n+ 规则引擎降级\n保证智能与稳定兼顾", palette.greenDark],
  ];
  let left = 72;
  for (const [title, body, accent] of cols) {
    ctx.addShape(slide, {
      left,
      top: 186,
      width: 250,
      height: 240,
      fill: "#FFFFFF",
      line: ctx.line(palette.line, 1),
    });
    ctx.addShape(slide, {
      left,
      top: 186,
      width: 250,
      height: 30,
      fill: accent,
      line: ctx.line(accent, 0),
    });
    ctx.addText(slide, {
      text: title,
      left: left + 18,
      top: 192,
      width: 210,
      height: 18,
      fontSize: 15,
      bold: true,
      color: "#FFFFFF",
    });
    ctx.addText(slide, {
      text: body,
      left: left + 18,
      top: 238,
      width: 210,
      height: 120,
      fontSize: 15,
      color: palette.ink,
    });
    left += 286;
  }

  ctx.addShape(slide, {
    left: 72,
    top: 474,
    width: 1136,
    height: 120,
    fill: palette.greenSoft,
    line: ctx.line(palette.line, 1),
  });
  ctx.addText(slide, {
    text: "技术实现要点",
    left: 100,
    top: 500,
    width: 160,
    height: 26,
    fontSize: 18,
    bold: true,
    color: palette.greenDark,
  });
  ctx.addText(slide, {
    text: "当前已完成前端页面骨架、后端服务骨架、MySQL 建表脚本、Docker Compose 联调环境，以及图片上传、用户评估价、评价与信誉机制等比赛展示关键能力。真实 AI 接口可继续平滑接入。",
    left: 100,
    top: 534,
    width: 1040,
    height: 34,
    fontSize: 16,
    color: palette.ink,
  });
  return slide;
}
