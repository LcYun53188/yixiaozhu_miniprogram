export const palette = {
  green: "#2F7D5C",
  greenDark: "#224838",
  greenSoft: "#E8F2DF",
  gold: "#F2B84B",
  ink: "#22352D",
  muted: "#6C7B72",
  paper: "#FFFDF7",
  line: "#DCE7D6",
  mint: "#CFE6D4",
  blue: "#2E74B5",
};

export function addPageBase(ctx, slide, { title, kicker, page, accent = palette.green }) {
  slide.background.fill = palette.paper;

  ctx.addShape(slide, {
    left: 0,
    top: 0,
    width: ctx.W,
    height: 720,
    fill: palette.paper,
    line: ctx.line(palette.paper, 0),
  });

  ctx.addShape(slide, {
    left: 0,
    top: 0,
    width: ctx.W,
    height: 26,
    fill: accent,
    line: ctx.line(accent, 0),
  });

  if (kicker) {
    ctx.addText(slide, {
      text: kicker,
      left: 72,
      top: 48,
      width: 260,
      height: 26,
      fontSize: 16,
      color: accent,
      bold: true,
      face: ctx.fonts.body,
    });
  }

  ctx.addText(slide, {
    text: title,
    left: 72,
    top: 82,
    width: 920,
    height: 56,
    fontSize: 28,
    color: palette.ink,
    bold: true,
    face: ctx.fonts.title,
  });

  ctx.addText(slide, {
    text: "益小助 | 基于 AI 的校园公益资源智能匹配小程序",
    left: 72,
    top: 674,
    width: 740,
    height: 20,
    fontSize: 10,
    color: palette.muted,
  });

  ctx.addText(slide, {
    text: String(page),
    left: 1166,
    top: 668,
    width: 42,
    height: 24,
    fontSize: 12,
    color: palette.muted,
    bold: true,
    align: "right",
  });
}

export function addBulletList(ctx, slide, { items, left, top, width, fontSize = 19, color = palette.ink, gap = 16 }) {
  let currentTop = top;
  for (const item of items) {
    ctx.addShape(slide, {
      left,
      top: currentTop + 8,
      width: 10,
      height: 10,
      fill: palette.green,
      line: ctx.line(palette.green, 0),
      geometry: "ellipse",
    });
    ctx.addText(slide, {
      text: item,
      left: left + 22,
      top: currentTop,
      width,
      height: 46,
      fontSize,
      color,
    });
    currentTop += 46 + gap;
  }
}

export function addCard(ctx, slide, { left, top, width, height, title, body, fill = "#FFFFFF", accent = palette.green }) {
  ctx.addShape(slide, {
    left,
    top,
    width,
    height,
    fill,
    line: ctx.line(palette.line, 1),
    radius: 18,
  });
  ctx.addShape(slide, {
    left,
    top,
    width: 8,
    height,
    fill: accent,
    line: ctx.line(accent, 0),
  });
  ctx.addText(slide, {
    text: title,
    left: left + 22,
    top: top + 18,
    width: width - 34,
    height: 28,
    fontSize: 18,
    bold: true,
    color: palette.ink,
  });
  ctx.addText(slide, {
    text: body,
    left: left + 22,
    top: top + 54,
    width: width - 34,
    height: height - 72,
    fontSize: 14,
    color: palette.muted,
  });
}

export function addMiniTag(ctx, slide, { text, left, top, fill = palette.greenSoft, color = palette.greenDark, width = 120 }) {
  ctx.addShape(slide, {
    left,
    top,
    width,
    height: 28,
    fill,
    line: ctx.line(fill, 0),
    radius: 14,
  });
  ctx.addText(slide, {
    text,
    left,
    top: top + 4,
    width,
    height: 18,
    fontSize: 12,
    color,
    bold: true,
    align: "center",
  });
}
