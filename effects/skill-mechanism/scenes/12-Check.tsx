import { interpolate, useCurrentFrame } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, StepNo } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

const CHECKS = [
  {
    t: "目录在不在",
    s: "打开目标技能目录，能看到以 Skill 名命名的文件夹",
    art: "▤",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    t: "SKILL.md 在不在",
    s: "进入该文件夹，第一层就有 SKILL.md",
    art: "MD",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
  {
    t: "清单里有没有",
    s: "在 Agent 里看一眼可用技能列表，或直接让它用一次",
    art: "✓",
    color: C.green,
    bg: C.greenSoft,
    line: C.greenLine,
  },
];

/** 12 装完自查：三层确认 + 一行检查命令 */
export const CheckScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame>
      <Nav chapter={3} label="怎么自查" page={nav.page} total={nav.total} />
      <SceneTitle label="CHECK · 自查" title="装完自查：三层确认" accent="三层确认" />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 214,
          width: 744,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {CHECKS.map((c, i) => {
          const start = 26 + i * 12;
          return (
            <Card
              key={c.t}
              style={{
                padding: "17px 20px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                ...rise(frame, start, 18, 16),
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  backgroundColor: c.bg,
                  border: `1px solid ${c.line}`,
                  color: c.color,
                  fontFamily: F.mono,
                  fontSize: 15,
                  fontWeight: 700,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {c.art}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.sans, fontSize: 20, fontWeight: 900, color: C.ink }}>
                  {c.t}
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: C.body2, marginTop: 5, lineHeight: 1.5 }}>
                  {c.s}
                </div>
              </div>
              <StepNo n={i + 1} color={c.color} bg={c.bg} size={26} />
            </Card>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 848, right: 64, top: 214 }}>
        <Card
          style={{
            padding: "20px 22px",
            backgroundColor: "#FBFBFD",
            ...rise(frame, 30, 20, 18),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ display: "flex", gap: 5 }}>
              {[C.accent, "#E9C46A", C.green].map((c) => (
                <span key={c} style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: c }} />
              ))}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: 11.5, letterSpacing: 2, color: C.muted }}>
              一行检查
            </span>
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 12.5, fontWeight: 800, color: C.muted }}>
            Windows PowerShell
          </div>
          <div
            style={{
              marginTop: 7,
              padding: "11px 13px",
              borderRadius: 8,
              backgroundColor: C.ink,
              fontFamily: F.mono,
              fontSize: 12.5,
              lineHeight: 1.7,
              color: "#F3F2F7",
              whiteSpace: "pre",
              opacity: interpolate(frame, [40, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span style={{ color: C.accentLine }}>dir</span> $env:USERPROFILE\.agents\skills |
            {"\n"}  % {"{ $_.Name }"}
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 12.5, fontWeight: 800, color: C.muted, marginTop: 16 }}>
            macOS / Linux
          </div>
          <div
            style={{
              marginTop: 7,
              padding: "11px 13px",
              borderRadius: 8,
              backgroundColor: C.ink,
              fontFamily: F.mono,
              fontSize: 12.5,
              color: "#F3F2F7",
              whiteSpace: "pre",
              opacity: interpolate(frame, [52, 72], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span style={{ color: C.accentLine }}>ls</span> ~/.agents/skills
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 13,
              borderTop: `1px solid ${C.line}`,
              fontFamily: F.sans,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: C.ink2,
              ...rise(frame, 76, 10, 14),
            }}
          >
            能列出你刚装的文件夹名，说明
            <span style={{ fontWeight: 900, color: C.green }}>位置对了</span>。
          </div>
        </Card>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};