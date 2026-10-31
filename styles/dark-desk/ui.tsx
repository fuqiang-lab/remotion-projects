import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, F, L, clampOpt, easeOut, rise, sceneFade } from "./theme";

// 字体在模块加载时统一注册，任何引用本文件的 Composition 都会自动就绪
loadNotoSansSC("normal", { weights: ["400", "500", "700", "900"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
loadJetBrainsMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

/* ------------------------------------------------------------------ */
/* 底板                                                                */
/* ------------------------------------------------------------------ */

/** 暗色桌面 + 极淡网格 + 顶部冷光。全片只放一次（由父级统一提供） */
export const Desk: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // 极慢的整体呼吸光，避免全片"死黑"
  const glow = 0.55 + 0.12 * Math.sin((frame / 30) * 0.35);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: [
            `linear-gradient(${C.line} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          ].join(","),
          backgroundSize: "56px 56px",
          opacity: 0.16,
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.18) 45%, transparent 75%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 55% at 50% 0%, rgba(226,114,74,${0.05 * glow}) 0%, rgba(23,22,26,0) 70%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 顶部导航                                                            */
/* ------------------------------------------------------------------ */

export type NavProps = {
  /** 当前章节序号（0 起）；null 表示非章节页 */
  readonly chapter?: number | null;
  /** 章节名；省略时按 chapters[chapter] 自动取 */
  readonly label?: string;
  /** 全片章节表 */
  readonly chapters?: readonly string[];
};

/** 顶栏：左品牌 + 当前章节 + 右侧页进度点（页码由数据推导） */
export const Nav: React.FC<NavProps> = ({ chapter = null, label, chapters }) => {
  const frame = useCurrentFrame();
  const name =
    chapter !== null && chapter !== undefined && chapters ? chapters[chapter] : (label ?? "");

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: L.navHeight,
        backgroundColor: C.chrome,
        borderBottom: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${L.gutter}px`,
        fontFamily: F.sans,
        ...rise(frame, 2, -8, 12),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: C.fg, letterSpacing: 0.2 }}>
          AI 提示词设计
        </span>
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            color: C.fg,
            letterSpacing: 1,
            padding: "2px 6px",
            borderRadius: 4,
            backgroundColor: C.muted,
          }}
        >
          CTRL+O
        </span>
        <span style={{ width: 1, height: 14, backgroundColor: C.line2 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 2.5 }}>
          AI 赋能教学设计专题研修
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.accent }}>
          {chapter === null || chapter === undefined
            ? "--"
            : String(chapter + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: C.fg2 }}>{name}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 场景标题                                                            */
/* ------------------------------------------------------------------ */

export type SceneTitleProps = {
  /** 眉标，形如 "02 · 提示词" */
  readonly label: string;
  readonly title: string;
  /** title 中要染成强调色的那段文字 */
  readonly accent?: string;
  readonly start?: number;
  readonly size?: number;
  readonly accentColor?: string;
};

export const SceneTitle: React.FC<SceneTitleProps> = ({
  label,
  title,
  accent,
  start = 6,
  size = 44,
  accentColor = C.accent,
}) => {
  const frame = useCurrentFrame();
  const idx = accent ? title.indexOf(accent) : -1;
  const head = idx >= 0 ? title.slice(0, idx) : title;
  const colored = idx >= 0 ? accent : "";
  const tail = idx >= 0 ? title.slice(idx + (accent?.length ?? 0)) : "";

  return (
    <div style={{ position: "absolute", left: L.gutter, top: L.eyebrowTop, fontFamily: F.sans }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 3.5,
          color: C.accent,
          marginBottom: 8,
          ...rise(frame, start, 8, 12),
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          color: C.fg,
          letterSpacing: -0.5,
          lineHeight: 1.16,
          whiteSpace: "nowrap",
          ...rise(frame, start + 3, 18, 16),
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
  /** 出现帧：与配音同帧进入 */
  readonly start: number;
  readonly width?: number;
};

/**
 * 底部居中的深色口播胶囊，白字。
 * 字号按宽度自适应（最长句 41 字也能一行放下），下方小竖线 + 品牌鳍片，取自参考片。
 */
export const CaptionPill: React.FC<CaptionPillProps> = ({ text, start, width }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const appear = interpolate(frame, [start, start + 10], [0, 1], {
    ...clampOpt,
    easing: easeOut,
  });
  const leave = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [1, 0],
    clampOpt,
  );
  const size = text.length > 34 ? 20 : text.length > 28 ? 21.5 : 23;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 22,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: appear * leave,
        translate: `0px ${interpolate(appear, [0, 1], [12, 0])}px`,
        fontFamily: F.sans,
      }}
    >
      <div
        style={{
          maxWidth: width ?? L.width - 200,
          padding: "12px 26px",
          borderRadius: 9,
          backgroundColor: C.pill,
          color: C.fg,
          fontSize: size,
          fontWeight: 600,
          letterSpacing: 0.3,
          whiteSpace: "nowrap",
          boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
          border: `1px solid ${C.line}`,
        }}
      >
        {text}
      </div>
      <div style={{ width: 2, height: 8, backgroundColor: C.chalk }} />
      <div
        style={{
          width: 30,
          height: 5,
          borderRadius: 2,
          backgroundColor: C.chalk,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 基础元素                                                            */
/* ------------------------------------------------------------------ */

/** 暗色卡片：深灰底 + 细描边 + 近实远虚双层阴影 */
export const Card: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: C.card,
      borderRadius: 12,
      border: `1px solid ${C.line}`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.25), 0 16px 34px rgba(0,0,0,0.28)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** 小胶囊标签 */
export const Tag: React.FC<{
  children?: React.ReactNode;
  color?: string;
  bg?: string;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({ children, color = C.fg2, bg = C.cardHi, mono, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 9px",
      borderRadius: 5,
      fontSize: 12,
      fontWeight: 600,
      color,
      backgroundColor: bg,
      fontFamily: mono ? F.mono : F.sans,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/**
 * 手绘斜线笔触（参考片里划过画面的白色粗线）。
 * 用略歪的四边形做"笔尖抖动"，比直线更像手绘；progress 0→1 从左划到右。
 */
export const ChalkLine: React.FC<{
  /** 起始 x / 终止 x */
  readonly x: [number, number];
  /** 起始 y / 终止 y */
  readonly y: [number, number];
  readonly start: number;
  readonly duration?: number;
  readonly thickness?: number;
  readonly color?: string;
  /** 线条倾斜修正（度），默认 -0.8，接近手绘 */
  readonly wobble?: number;
}> = ({ x, y, start, duration = 14, thickness = 6, color = C.chalk, wobble = -0.8 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    ...clampOpt,
    easing: easeOut,
  });
  if (p <= 0) return null;
  const x2 = x[0] + (x[1] - x[0]) * p;
  const y2 = y[0] + (y[1] - y[0]) * p;
  const len = Math.hypot(x2 - x[0], y2 - y[0]);
  return (
    <div
      style={{
        position: "absolute",
        left: Math.min(x[0], x2),
        top: (y[0] + y2) / 2 - thickness / 2,
        width: len,
        height: thickness,
        backgroundColor: color,
        transformOrigin: "0 50%",
        rotate: `${(Math.atan2(y2 - y[0], x2 - x[0]) * 180) / Math.PI + wobble}deg`,
        borderRadius: 3,
        boxShadow: "0 0 14px rgba(245,243,239,0.18)",
      }}
    />
  );
};

/** 手绘圆圈（套住关键词）：SVG 椭圆描边，带描边生长 */
export const ChalkCircle: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly start: number;
  readonly duration?: number;
  readonly color?: string;
  readonly stroke?: number;
}> = ({ width, height, start, duration = 16, color = C.chalk, stroke = 3.5 }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [start, start + duration], [0, 1], {
    ...clampOpt,
    easing: easeOut,
  });
  const dash = 2 * (width + height) * 1.05;
  const cx = (width + 20) / 2;
  const cy = (height + 16) / 2;
  return (
    <svg
      width={width + 20}
      height={height + 16}
      viewBox={`0 0 ${width + 20} ${height + 16}`}
      style={{ position: "absolute", left: -10, top: -8, overflow: "visible", pointerEvents: "none" }}
    >
      {/* 主体椭圆 */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={width / 2 + 3}
        ry={height / 2 + 1}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash}`}
        strokeDashoffset={dash * (1 - draw)}
        transform={`rotate(-1.4 ${cx} ${cy})`}
      />
      {/* 第二笔：略微错位的更快圈，让线条看起来像手画了两遍 */}
      {draw > 0.35 ? (
        <ellipse
          cx={cx}
          cy={cy}
          rx={width / 2 - 1}
          ry={height / 2 - 2}
          fill="none"
          stroke={color}
          strokeWidth={Math.max(1.5, stroke - 1.4)}
          strokeLinecap="round"
          strokeOpacity={0.55}
          strokeDasharray={`${dash}`}
          strokeDashoffset={dash * (1 - Math.min(1, (draw - 0.35) / 0.6))}
          transform={`rotate(1.1 ${cx} ${cy})`}
        />
      ) : null}
    </svg>
  );
};

/** 数字序号（橙色等宽，形如 01） */
export const Num: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = C.accent,
  size = 13,
}) => (
  <span style={{ fontFamily: F.mono, fontSize: size, fontWeight: 500, color, letterSpacing: 1 }}>
    {children}
  </span>
);

/** 细箭头（→），用于流程 */
export const Arrow: React.FC<{ color?: string; size?: number; dashed?: boolean }> = ({
  color = C.muted,
  size = 16,
  dashed,
}) => (
  <svg width={size * 1.9} height={size} viewBox="0 0 30 16" style={{ flexShrink: 0 }}>
    <line
      x1={1}
      y1={8}
      x2={21}
      y2={8}
      stroke={color}
      strokeWidth={1.6}
      strokeDasharray={dashed ? "3 3" : undefined}
      strokeLinecap="round"
    />
    <polyline
      points="16,3 23,8 16,13"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 勾选 / 叉号圆点 */
export const Mark: React.FC<{
  ok?: boolean;
  warn?: boolean;
  size?: number;
  color?: string;
}> = ({ ok = true, warn = false, size = 18, color }) => {
  const bg = color ?? (warn ? C.warn : ok ? C.green : C.red);
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: bg,
        color: "#151318",
        display: "grid",
        placeItems: "center",
        fontSize: size * 0.6,
        fontWeight: 900,
        flexShrink: 0,
      }}
    >
      {warn ? "!" : ok ? "✓" : "×"}
    </span>
  );
};

/** 弹出：spring 缩放 + 淡入，返回可直接铺开的 style */
export const pop = (frame: number, fps: number, start: number, damping = 15, mass = 0.65) => {
  const s = spring({ frame: frame - start, fps, config: { damping, mass } });
  return {
    opacity: interpolate(frame, [start, start + 6], [0, 1], clampOpt),
    scale: String(0.9 + 0.1 * s),
  };
};

/** 确定性微抖（给"手绘/贴纸"元素用，禁止 Math.random） */
export const jitter = (seed: string, frame: number, amp = 1) =>
  (random(seed) - 0.5) * 2 * amp * Math.sin(frame / 9 + random(seed + "p") * 6.28);

/* ------------------------------------------------------------------ */
/* 场景外壳                                                            */
/* ------------------------------------------------------------------ */

/** 场景外壳：只做首尾淡化，底板由 Desk 统一提供，避免切换时露底 */
export const SceneFrame: React.FC<{
  children?: React.ReactNode;
  /** 额外下边距（字幕带） */
  readonly padBottom?: number;
}> = ({ children, padBottom = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <AbsoluteFill style={{ paddingBottom: padBottom }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 场景道具：导航 + 标题，减少每个场景的重复 */
export const Stage: React.FC<{
  readonly chapter: number | null;
  readonly chapters: readonly string[];
  readonly label: string;
  readonly title: string;
  readonly accent?: string;
  readonly titleStart?: number;
  readonly titleSize?: number;
}> = ({ chapter, chapters, label, title, accent, titleStart, titleSize }) => (
  <>
    <Nav chapter={chapter} chapters={chapters} />
    <SceneTitle
      label={label}
      title={title}
      accent={accent}
      start={titleStart}
      size={titleSize}
    />
  </>
);