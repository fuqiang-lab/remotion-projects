import { Easing, interpolate } from "remotion";

/**
 * Editorial Light（米白编辑风）设计令牌。
 * 取值来自 References/remotion视频创作教程.mp4 的逐像素采样，
 * 完整规范见同目录 README.md。
 */
export const C = {
  /** 全片底色：冷调米白 */
  paper: "#F4F3F8",
  paper2: "#EDEBF2",
  /** 主标题 / 强正文 */
  ink: "#22252D",
  /** 正文 */
  ink2: "#3A3F4B",
  /** 次要说明 */
  muted: "#8C8FA0",
  /** 描边、分隔线、网格 */
  line: "#E2E0E7",

  /** 主强调色：关键词、序号、正向提示 */
  accent: "#E06C3C",
  accentSoft: "#FBE7DC",
  accentLine: "#EFBBA2",
  /** 次强调：对比项、数据 */
  blue: "#4C74E0",
  blueSoft: "#E4ECFB",
  /** 完成态 / 勾选 */
  green: "#2E9E6A",
  greenSoft: "#E1F1E8",
  /** 第三类语义（可选） */
  purple: "#7A5BD6",
  purpleSoft: "#EEE8FB",

  /** 卡片 */
  card: "#FFFFFF",
  /** 口播胶囊字幕（实测 #343C4A） */
  pill: "#343C4A",
  /** 等轴测地台台面 */
  plane: "#CFE3F8",
  planeEdge: "#AFCDEA",
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
  /** 顶部导航下沿 */
  navBottom: 72,
  /** 场景标题：眉标顶部 / 标题顶部 */
  titleTop: 96,
  /** 主体内容起始 y */
  contentTop: 200,
  /** 底部字幕带高度，主体不要进入 */
  captionBand: 124,
};

/** 主入场曲线：先快后缓，收得干净 */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 上浮 + 淡入（最常用的入场） */
export const rise = (
  frame: number,
  start: number,
  distance = 20,
  duration = 18,
) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: easeOut,
  }),
  translate: `${interpolate(frame, [start, start + duration], [distance, 0], {
    ...clamp,
    easing: easeOut,
  })}px 0px`,
});

/** 0→1 的进度，用于驱动描边、进度条、逐字打字 */
export const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], clamp);

/** 场景首尾淡入淡出（默认各 14 帧） */
export const sceneFade = (
  frame: number,
  total: number,
  fadeIn = 14,
  fadeOut = 14,
) => interpolate(frame, [0, fadeIn, total - fadeOut, total], [0, 1, 1, 0], clamp);

/** 错峰：第 i 个元素的入场帧 */
export const stagger = (base: number, i: number, gap = 10) => base + i * gap;