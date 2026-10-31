import { Easing, interpolate } from "remotion";

/**
 * 动效辅助函数 —— 与 styles/editorial-light/theme.ts 中同名函数保持一致：
 * 入场曲线 Easing.bezier(0.16, 1, 0.3, 1)，上浮 16–24px，16–20 帧。
 * 单列一个文件，是因为它们依赖 remotion 的运行时函数，
 * theme.ts 只保留纯常量（色值 / 字体），便于被任何环境安全引用。
 */

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 上浮 + 淡入（最常用的入场） */
export const rise = (frame: number, start: number, distance = 20, duration = 18) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeOut }),
  translate: `${interpolate(frame, [start, start + duration], [distance, 0], {
    ...clamp,
    easing: easeOut,
  })}px 0px`,
});

/** 0→1 的线性进度，用于驱动描边、填充、箭头生长 */
export const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], clamp);

/** 错峰：第 i 个元素的入场帧 */
export const stagger = (base: number, i: number, gap = 10) => base + i * gap;