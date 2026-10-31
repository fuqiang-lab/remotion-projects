import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "./theme";
import { rise } from "./theme-helpers";

/**
 * 本片的版式组件：Paper / Nav / SceneTitle / CaptionPill / Card / Tag / SceneFrame。
 * 全部改自 styles/editorial-light/ui.tsx 的同名组件，只多了「章节名 / 页码由数据推导」这一层，
 * 版式尺寸与动效曲线严格沿用风格库 README 的规范（64px 边距、124px 字幕带、14 帧首尾淡化）。
 */

export const L = {
  width: 1280,
  height: 720,
  gutter: 64,
  navBottom: 72,
  titleTop: 96,
  contentTop: 200,
  captionBand: 124,
} as const;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const sceneFade = (frame: number, total: number, fadeIn = 14, fadeOut = 14) =>
  interpolate(frame, [0, fadeIn, total - fadeOut, total], [0, 1, 1, 0], clamp);

/* ------------------------------------------------------------------ */

/** 米白纸面 + 顶部隐现细网格。全片只放一次（由父级统一提供），场景只做透明度过渡 */
export const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        backgroundImage: [
          `linear-gradient(${C.line} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        ].join(","),
        backgroundSize: "48px 48px",
        opacity: 0.4,
        maskImage:
          "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.12) 40%, transparent 68%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.85) 0%, rgba(244,243,248,0) 55%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */

export type NavProps = {
  /** 章节序号（0 起）；省略或 null 表示非章节页 */
  readonly chapter?: number | null;
  /** 右侧当前页名称 */
  readonly label: string;
  /** 当前页在全片中的序号（1 起） */
  readonly page: number;
  /** 全片场景总数 */
  readonly total: number;
  readonly brand?: string;
  readonly sub?: string;
};

/** 顶部品牌栏：左品牌，右「页码 · 名称」 */
export const Nav: React.FC<NavProps> = ({
  chapter = null,
  label,
  page,
  total,
  brand = "AI 赋能教学创新",
  sub = "工具 · 方法 · 案例",
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 44,
        right: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: F.sans,
        ...rise(frame, 4, -10, 16),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>
          {brand}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 3 }}>
          {sub}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: F.mono, fontSize: 12.5, color: C.accent }}>
          {chapter === null || chapter === undefined
            ? "--"
            : String(chapter + 1).padStart(2, "0")}
        </span>
        <span style={{ width: 1, height: 13, backgroundColor: C.line }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: C.ink2 }}>{label}</span>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.muted, marginLeft: 6 }}>
          {String(page).padStart(2, "0")} / {total}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.line} 8%, ${C.line} 92%, transparent)`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */

export type SceneTitleProps = {
  /** 眉标，形如 "STEP 3 · 放置" */
  readonly label: string;
  readonly title: string;
  /** title 中染成强调色的片段 */
  readonly accent?: string;
  readonly start?: number;
  readonly size?: number;
};

/** 场景标题：眉标 + 大标题（关键词染橙） */
export const SceneTitle: React.FC<SceneTitleProps> = ({
  label,
  title,
  accent,
  start = 8,
  size = 46,
}) => {
  const frame = useCurrentFrame();
  const idx = accent ? title.indexOf(accent) : -1;
  const head = idx >= 0 ? title.slice(0, idx) : title;
  const colored = idx >= 0 ? accent : "";
  const tail = idx >= 0 ? title.slice(idx + (accent?.length ?? 0)) : "";

  return (
    <div style={{ position: "absolute", left: L.gutter, top: L.titleTop, fontFamily: F.sans }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 4,
          color: C.accent,
          marginBottom: 12,
          ...rise(frame, start, 10, 14),
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          color: C.ink,
          letterSpacing: -0.6,
          lineHeight: 1.18,
          whiteSpace: "nowrap",
          ...rise(frame, start + 4, 20, 16),
        }}
      >
        {head}
        {colored ? <span style={{ color: C.accent }}>{colored}</span> : null}
        {tail}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

/** 底部居中深灰胶囊字幕：逐屏显示该屏口播原句 */
export const CaptionPill: React.FC<{
  readonly text: string;
  readonly start: number;
  readonly width?: number;
}> = ({ text, start, width }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const appear = interpolate(frame, [start, start + 14], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const leave = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 26,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: appear * leave,
        translate: `0px ${interpolate(appear, [0, 1], [14, 0])}px`,
      }}
    >
      <div
        style={{
          maxWidth: width ?? L.width - 120,
          padding: "13px 26px",
          borderRadius: 10,
          backgroundColor: C.pill,
          color: "#F6F5F2",
          fontFamily: F.sans,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 0.4,
          whiteSpace: "nowrap",
          boxShadow: "0 10px 24px rgba(20,24,31,0.22)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

/** 白色圆角卡片 */
export const Card: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: C.card,
      borderRadius: 16,
      border: `1px solid ${C.line}`,
      boxShadow: "0 2px 4px rgba(20,24,31,0.03), 0 14px 34px rgba(20,24,31,0.07)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** 小号胶囊标签 */
export const Tag: React.FC<{
  children?: React.ReactNode;
  color?: string;
  bg?: string;
  mono?: boolean;
}> = ({ children, color = C.ink2, bg = "#EFEDF3", mono }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 600,
      color,
      backgroundColor: bg,
      fontFamily: mono ? F.mono : F.sans,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

/** 序号圆点 */
export const StepNo: React.FC<{
  readonly n: number | string;
  readonly color?: string;
  readonly bg?: string;
  readonly size?: number;
}> = ({ n, color = C.accent, bg = C.accentSoft, size = 30 }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      backgroundColor: bg,
      color,
      fontFamily: F.mono,
      fontSize: size * 0.44,
      fontWeight: 700,
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
    }}
  >
    {n}
  </span>
);

/* ------------------------------------------------------------------ */

/**
 * 场景外壳：只做首尾淡入淡出，底板由父级 Paper 统一提供（避免切换时露白）。
 * padBottom 把主体内容推离底部字幕带。
 */
export const SceneFrame: React.FC<{ children?: React.ReactNode; padBottom?: number }> = ({
  children,
  padBottom = L.captionBand,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <AbsoluteFill style={{ paddingBottom: padBottom }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};