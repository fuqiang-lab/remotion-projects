import { Easing, interpolate } from "remotion";

/**
 * 视觉语言取自 References/remotion视频创作教程.mp4：
 * 米白纸面、深墨色标题、橙色重点强调、白色圆角卡片、
 * 淡蓝等轴测地台、深色浮动字幕胶囊。
 */
export const C = {
  paper: "#F5F3EF",
  paper2: "#EFECE6",
  ink: "#14181F",
  ink2: "#3A4250",
  muted: "#8A8F99",
  line: "#E3DFD6",
  accent: "#DA6B3C",
  accentSoft: "#F7E3D8",
  accentLine: "#EEB79E",
  blue: "#4B72E0",
  blueSoft: "#E6EDFB",
  green: "#2F9E68",
  greenSoft: "#E1F1E8",
  purple: "#7A5BD6",
  purpleSoft: "#EEE8FB",
  card: "#FFFFFF",
  pill: "#23262D",
  plane: "#C5DDF0",
  planeEdge: "#A8CBE6",
};

export const F = {
  sans: `"Inter", "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif`,
  mono: `"JetBrains Mono", "Cascadia Mono", Consolas, monospace`,
};

/** 柔和淡出淡入，供场景首尾使用 */
export const smooth = Easing.bezier(0.16, 1, 0.3, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 元素入场：上浮 + 淡入 */
export const rise = (
  frame: number,
  start: number,
  distance = 24,
  duration = 18,
) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: smooth,
  }),
  translate: `${interpolate(frame, [start, start + duration], [distance, 0], {
    ...clamp,
    easing: smooth,
  })}px 0px`,
});

/** 场景两端淡入淡出，避免硬切 */
export const sceneFade = (frame: number, total: number, fadeIn = 12, fadeOut = 12) =>
  interpolate(frame, [0, fadeIn, total - fadeOut, total], [0, 1, 1, 0], clamp);