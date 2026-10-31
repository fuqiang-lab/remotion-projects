import type React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise, stagger } from "../theme-helpers";

const ITEMS = [
  { no: "01", title: "是什么", sub: "把一套做法固化下来", color: C.accent, bg: C.accentSoft, line: C.accentLine },
  { no: "02", title: "怎么加载", sub: "三级渐进，按需打开", color: C.blue, bg: C.blueSoft, line: C.blueLine },
  { no: "03", title: "装在哪", sub: "全局安装与项目安装", color: C.green, bg: C.greenSoft, line: C.greenLine },
  { no: "04", title: "怎么自查", sub: "装完怎样确认生效", color: C.purple, bg: C.purpleSoft, line: C.purpleLine },
];

const ICONS: Record<string, React.ReactNode> = {
  "01": (
    <path
      d="M11 19l5-5 3 3 5-7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "02": (
    <>
      <path d="M12 7v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 13l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "03": (
    <path
      d="M20 13h-4a2 2 0 01-2-2V9h-7v9h7v-2a2 2 0 012-2h4"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  "04": (
    <>
      <path d="M11 16l2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="2.2" />
    </>
  ),
};

/** 02 本讲路线：四件事，10 分钟 */
export const RouteScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame>
      <Nav chapter={null} label="本讲路线" page={nav.page} total={nav.total} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 116,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 5,
          color: C.muted,
          ...rise(frame, 6, 10, 14),
        }}
      >
        本讲路线 · 只讲四件事
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 152,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: -0.6,
          color: C.ink,
          ...rise(frame, 10, 18, 16),
        }}
      >
        今天只讲清楚 <span style={{ color: C.accent }}>四件事</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 258,
          display: "flex",
          gap: 18,
          justifyContent: "center",
        }}
      >
        {ITEMS.map((item, i) => {
          const start = stagger(20, i, 9);
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <Card
              key={item.no}
              style={{
                width: 264,
                height: 214,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 30}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    backgroundColor: item.bg,
                    border: `1px solid ${item.line}`,
                    color: item.color,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    {ICONS[item.no]}
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 16,
                    fontWeight: 500,
                    color: C.ink2,
                  }}
                >
                  {item.no}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 28,
                    fontWeight: 900,
                    color: C.ink,
                    letterSpacing: -0.4,
                  }}
                >
                  {item.title}
                </div>
                <div style={{ marginTop: 7, fontFamily: F.sans, fontSize: 15.5, color: C.ink2 }}>
                  {item.sub}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 498,
          display: "flex",
          justifyContent: "center",
          gap: 10,
          fontFamily: F.sans,
          fontSize: 15,
          color: C.ink2,
          ...rise(frame, 66, 10, 14),
        }}
      >
        {["10 分钟", "不展开怎么写", "课后材料：写 SKILL.md"].map((t, i) => (
          <span
            key={t}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: `1px ${i === 1 ? "dashed" : "solid"} ${i === 1 ? C.muted : C.accentLine}`,
              backgroundColor: i === 1 ? "rgba(255,255,255,0.9)" : C.accentSoft,
              color: i === 1 ? C.ink2 : C.accent,
              fontWeight: 700,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};