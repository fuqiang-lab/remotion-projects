import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, L, clamp, rise, sceneFade } from "./theme";

// 字体在模块加载时统一注册，任何引用本文件的 Composition 都会自动就绪
loadNotoSansSC("normal", { weights: ["400", "500", "700", "900"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
loadJetBrainsMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

/* ------------------------------------------------------------------ */
/* 底板                                                                */
/* ------------------------------------------------------------------ */

/** 米白纸面 + 顶部隐现的细网格。全片只放一次（由父级统一提供） */
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
/* 顶部导航                                                            */
/* ------------------------------------------------------------------ */

export type NavProps = {
  /** 章节序号（0 起）；null 表示非章节页（开场 / 收尾） */
  readonly chapter?: number | null;
  /** 品牌名 */
  readonly brand?: string;
  /** 品牌副标题 */
  readonly sub?: string;
  /** 右侧当前页名称；章节页可省略，自动取 chapters[chapter] */
  readonly label?: string;
  /** 全片章节表，用于自动显示名称 */
  readonly chapters?: readonly string[];
  /** 章节数字颜色 */
  readonly chapterColor?: string;
};

/** 顶部品牌栏：左品牌，右「序号 · 章节名」 */
export const Nav: React.FC<NavProps> = ({
  chapter = null,
  brand = "DSH",
  sub = "DEEPSEEK HARNESS",
  label,
  chapters,
  chapterColor = C.green,
}) => {
  const frame = useCurrentFrame();
  const name =
    chapter !== null && chapter !== undefined && chapters
      ? chapters[chapter]
      : (label ?? "");

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
        <span style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>
          {brand}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 3 }}>
          {sub}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: F.mono, fontSize: 13, color: chapterColor }}>
          {chapter === null || chapter === undefined
            ? "--"
            : String(chapter + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.ink2 }}>{name}</span>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            border: `1.5px solid ${C.ink}`,
            color: C.ink,
            display: "grid",
            placeItems: "center",
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          ›
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
/* 场景标题                                                            */
/* ------------------------------------------------------------------ */

export type SceneTitleProps = {
  /** 眉标，形如 "STEP 3 · 项目搭建" */
  readonly label: string;
  readonly title: string;
  /** title 中要染成强调色的那段文字（可选） */
  readonly accent?: string;
  readonly start?: number;
  readonly size?: number;
  readonly accentColor?: string;
};

export const SceneTitle: React.FC<SceneTitleProps> = ({
  label,
  title,
  accent,
  start = 8,
  size = 46,
  accentColor = C.accent,
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
          color: accentColor,
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
        {colored ? <span style={{ color: accentColor }}>{colored}</span> : null}
        {tail}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 口播胶囊字幕                                                        */
/* ------------------------------------------------------------------ */

export type CaptionPillProps = {
  readonly text: string;
  /** 出现帧；常在约 40 帧（1.3s）时与口播同步 */
  readonly start: number;
  readonly width?: number;
  readonly style?: React.CSSProperties;
};

/** 底部居中深灰胶囊，整屏常驻 */
export const CaptionPill: React.FC<CaptionPillProps> = ({
  text,
  start,
  width,
  style,
}) => {
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
          maxWidth: width ?? L.width - 420,
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
          ...style,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 基础元素                                                            */
/* ------------------------------------------------------------------ */

export type CardProps = {
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
};

/** 白色圆角卡片：固定双层阴影 + 细描边 */
export const Card: React.FC<CardProps> = ({ children, style }) => (
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

export type TagProps = {
  readonly children?: React.ReactNode;
  readonly color?: string;
  readonly bg?: string;
  /** 用等宽字体（适合英文/代码标签） */
  readonly mono?: boolean;
};

/** 小号胶囊标签 */
export const Tag: React.FC<TagProps> = ({
  children,
  color = C.ink2,
  bg = "#EFEDF3",
  mono,
}) => (
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

/** 勾选圆点 */
export const Check: React.FC<{ color?: string; size?: number }> = ({
  color = C.green,
  size = 18,
}) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      backgroundColor: color,
      color: "#FFFFFF",
      display: "grid",
      placeItems: "center",
      fontSize: size * 0.62,
      flexShrink: 0,
    }}
  >
    ✓
  </span>
);

/* ------------------------------------------------------------------ */
/* 场景外壳                                                            */
/* ------------------------------------------------------------------ */

/**
 * 场景外壳：负责首尾淡入淡出。
 * 底板（Paper）由父级统一提供，避免场景切换时露白。
 * padBottom 用来把主体内容推离底部字幕带。
 */
export const SceneFrame: React.FC<{ children?: React.ReactNode; padBottom?: number }> = ({
  children,
  padBottom = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <AbsoluteFill style={{ paddingBottom: padBottom }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};