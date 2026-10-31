import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, rise, sceneFade } from "./theme";

loadNotoSansSC("normal", {
  weights: ["400", "500", "700", "900"],
});
loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
loadJetBrainsMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const CHAPTERS = [
  "它是什么",
  "核心能力",
  "五步上手",
  "技能与记忆",
  "协作与收尾",
] as const;

/** 米白纸面 + 顶部细网格线，所有场景共用的底板 */
export const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: [
            `linear-gradient(${C.line} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          ].join(","),
          backgroundSize: "48px 48px",
          opacity: 0.35,
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) 42%, transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.85) 0%, rgba(245,243,239,0) 55%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** 顶部导航：左品牌 + 右章节序号，与参考视频一致 */
export const Nav: React.FC<{ chapter: number | null; label?: string }> = ({
  chapter,
  label,
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
        fontSize: 16,
        ...rise(frame, 4, -10, 16),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, letterSpacing: 1 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>
          DSH
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 3 }}>
          DEEPSEEK HARNESS
        </span>
        <span
          style={{
            width: 1,
            height: 14,
            backgroundColor: C.line,
          }}
        />
        <span style={{ fontSize: 12, color: C.muted, letterSpacing: 2 }}>认识 DSH</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.ink2 }}>
        <span style={{ fontFamily: F.mono, fontSize: 13, color: C.muted }}>
          {chapter === null ? "--" : String(chapter + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          {chapter === null ? (label ?? "导览") : CHAPTERS[chapter]}
        </span>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            border: `1.5px solid ${C.ink}`,
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
          background: `linear-gradient(90deg, transparent, ${C.line} 12%, ${C.line} 88%, transparent)`,
        }}
      />
    </div>
  );
};

/** 场景眼睛标签 + 大标题，其中 need 部分染成橙色 */
export const SceneTitle: React.FC<{
  label: string;
  title: string;
  accent?: string;
  start?: number;
  size?: number;
}> = ({ label, title, accent, start = 8, size = 46 }) => {
  const frame = useCurrentFrame();
  const [head, tail] = accent
    ? [title.slice(0, title.indexOf(accent)), title.slice(title.indexOf(accent) + accent.length)]
    : [title, ""];

  return (
    <div style={{ position: "absolute", left: 64, top: 96, fontFamily: F.sans }}>
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
          ...rise(frame, start + 4, 20, 16),
        }}
      >
        {head}
        {accent ? <span style={{ color: C.accent }}>{accent}</span> : null}
        {tail}
      </div>
    </div>
  );
};

/** 深色浮动字幕胶囊：讲解者口播的那一句话 */
export const CaptionPill: React.FC<{ text: string; start: number; width?: number }> = ({
  text,
  start,
  width,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const appear = interpolate(frame, [start, start + 14], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const leave = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [1, 0],
    clamp,
  );

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
          maxWidth: width ?? 860,
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

/** 白色圆角卡片 */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
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

/** 胶囊标签 */
export const Tag: React.FC<{
  children: React.ReactNode;
  color?: string;
  bg?: string;
  mono?: boolean;
}> = ({ children, color = C.ink2, bg = "#F1EFEA", mono }) => (
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

/** 首尾整体淡入淡出；底板由父级统一提供，避免切换时露出空白 */
export const SceneFrame: React.FC<{ children: React.ReactNode; padBottom?: number }> = ({
  children,
  padBottom = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames, 14, 14) }}>
      <AbsoluteFill style={{ paddingBottom: padBottom }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};