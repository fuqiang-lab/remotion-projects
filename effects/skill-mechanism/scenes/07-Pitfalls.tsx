import { interpolate, useCurrentFrame } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

const PITFALLS = [
  {
    no: "01",
    level: "第 1 级",
    bad: "描述写得太含糊",
    why: "第 1 级就判不出来该不该用",
    fix: "写清「什么时候该用它」",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    no: "02",
    level: "第 2 级",
    bad: "正文里塞满长文",
    why: "一加载就吃掉大量上下文",
    fix: "正文只留流程与约束",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
  {
    no: "03",
    level: "第 3 级",
    bad: "资源写成必读",
    why: "第 3 级的省钱设计直接失效",
    fix: "写成「需要时才读」",
    color: C.purple,
    bg: C.purpleSoft,
    line: C.purpleLine,
  },
];

/** 07 三个容易踩的坑：一坑一卡，右列给改法 */
export const PitfallScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame>
      <Nav chapter={1} label="怎么加载" page={nav.page} total={nav.total} />
      <SceneTitle
        label="PITFALL · 三个坑"
        title="三个容易踩的坑，正对三级"
        accent="三个坑"
      />

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 236,
          display: "flex",
          gap: 18,
        }}
      >
        {PITFALLS.map((p, i) => {
          const start = 26 + i * 12;
          return (
            <Card
              key={p.no}
              style={{
                flex: 1,
                height: 268,
                padding: "20px 20px 18px",
                display: "flex",
                flexDirection: "column",
                ...rise(frame, start, 24, 18),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    color: p.color,
                    backgroundColor: p.bg,
                    border: `1px solid ${p.line}`,
                    padding: "4px 9px",
                    borderRadius: 6,
                  }}
                >
                  {p.level}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: 14, color: C.line }}>
                  {p.no}
                </span>
              </div>

              <div
                style={{
                  display: "inline-block",
                  alignSelf: "flex-start",
                  marginTop: 14,
                  padding: "3px 10px",
                  borderRadius: 8,
                  backgroundColor: C.accentSoft,
                  fontFamily: F.sans,
                  fontSize: 21,
                  fontWeight: 900,
                  color: C.ink,
                  lineHeight: 1.4,
                  textDecoration: "line-through",
                  textDecorationColor: C.accent,
                  textDecorationThickness: 2,
                }}
              >
                {p.bad}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  fontFamily: F.sans,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: C.body2,
                }}
              >
                <span style={{ color: C.accent, fontWeight: 800, lineHeight: 1.4 }}>×</span>
                <span>{p.why}</span>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  padding: "11px 13px",
                  borderRadius: 10,
                  backgroundColor: "#FAFAFD",
                  border: `1px dashed ${p.line}`,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  opacity: interpolate(frame, [start + 26, start + 40], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  translate: `0px ${interpolate(frame, [start + 26, start + 40], [10, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px`,
                }}
              >
                <span style={{ color: C.green, fontWeight: 900, lineHeight: 1.4 }}>✓</span>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: 11.5, fontWeight: 800, letterSpacing: 1.5, color: C.muted }}>
                    改法
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 3 }}>
                    {p.fix}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 538,
          display: "flex",
          justifyContent: "center",
          fontFamily: F.sans,
          fontSize: 16,
          color: C.ink2,
          ...rise(frame, 74, 12, 16),
        }}
      >
        <span
          style={{
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: C.accentSoft,
            border: `1px solid ${C.accentLine}`,
            color: C.accent,
            fontWeight: 700,
          }}
        >
          诀窍只有一条：第一层的描述，要写到模型一眼就能判断该不该用
        </span>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};