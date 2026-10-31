import { Easing, interpolate } from "remotion";

/**
 * Dark Desk（暗色讲台风）设计令牌。
 * 取自 References/动画效果.mp4 的逐像素采样（暗底、卡片灰、橘色强调、白色手绘斜线、深色口播胶囊），
 * 为课堂投影做了提亮：底色比参考片略亮，文字对比度放到 ≥ 7:1。
 * 完整规范见同目录 README.md。
 */
export const C = {
  /** 全片底色（比参考片 #131116 提亮一档，投影不发黑） */
  bg: "#17161A",
  bg2: "#1D1C21",
  /** 顶栏 / 底栏 */
  chrome: "#121115",
  /** 卡片 */
  card: "#222127",
  cardHi: "#2A2930",
  /** 卡片描边 */
  line: "#34333B",
  line2: "#46454F",

  /** 主文字 */
  fg: "#F3F1EE",
  /** 正文 */
  fg2: "#C8C5CD",
  /** 次要说明 */
  muted: "#8F8C99",

  /** 主强调：橘（参考片同色） */
  accent: "#E2724A",
  accentSoft: "rgba(226, 114, 74, 0.14)",
  accentLine: "rgba(226, 114, 74, 0.45)",
  /** 次强调：蓝 */
  blue: "#6C8CF0",
  blueSoft: "rgba(108, 140, 240, 0.15)",
  blueBright: "#3F65E8",
  /** 完成 / 通过 */
  green: "#4BC08A",
  greenSoft: "rgba(75, 192, 138, 0.14)",
  /** 警示 */
  warn: "#E8B84B",
  warnSoft: "rgba(232, 184, 75, 0.14)",
  /** 否定 */
  red: "#E5645E",
  redSoft: "rgba(229, 100, 94, 0.14)",

  /** 白色手绘斜线（参考片的高亮笔触） */
  chalk: "#F5F3EF",
  /** 口播胶囊底 */
  pill: "#0E0D10",
};

export const F = {
  sans: `"Inter", "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif`,
  mono: `"JetBrains Mono", "Cascadia Mono", Consolas, monospace`,
};

/** 版式常量（1280×720 基准） */
export const L = {
  width: 1280,
  height: 720,
  /** 左右安全边距 */
  gutter: 64,
  /** 顶部导航条高度 */
  navHeight: 52,
  /** 眉标 / 标题顶部 */
  eyebrowTop: 84,
  titleTop: 106,
  /** 主体区起始 y */
  contentTop: 206,
  /** 底部字幕带高度，主体不要进入 */
  captionBand: 118,
};

/** 主入场曲线：先快后缓，收得干净（与 Editorial Light 一致） */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 截断区间（给 interpolate 的 extrapolate 选项用） */
export const clampOpt = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 把帧区间裁到 0–1，最常用的写法：clamp((frame - start) / 12) */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** 上浮 + 淡入 */
export const rise = (frame: number, start: number, distance = 18, duration = 16) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], {
    ...clampOpt,
    easing: easeOut,
  }),
  translate: `${interpolate(frame, [start, start + duration], [distance, 0], {
    ...clampOpt,
    easing: easeOut,
  })}px 0px`,
});

/** 0→1 进度 */
export const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], clampOpt);

/** 场景首尾淡入淡出（默认各 12 帧，Sequence 之间另有 0.4s 重叠） */
export const sceneFade = (frame: number, total: number, fadeIn = 12, fadeOut = 12) =>
  interpolate(frame, [0, fadeIn, total - fadeOut, total], [0, 1, 1, 0], clampOpt);

/** 错峰 */
export const stagger = (base: number, i: number, gap = 8) => base + i * gap;