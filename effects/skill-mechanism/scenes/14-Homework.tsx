import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, StepNo } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise, stagger } from "../theme-helpers";

const TASKS = [
  {
    t: "装一个",
    s: "挑一个马上要用的 Skill，装到用户目录",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    t: "自检一次",
    s: "三层确认走一遍，确认它在清单里",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
  {
    t: "写一个",
    s: "把自己的固定做法写成一个 SKILL.md",
    color: C.green,
    bg: C.greenSoft,
    line: C.greenLine,
  },
];

/** 14 课后三件事 */
export const HomeworkScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame>
      <Nav chapter={3} label="课后" page={nav.page} total={nav.total} />
      <SceneTitle label="AFTER · 课后" title="课后可做的三件事" accent="三件事" />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 224,
          display: "flex",
          gap: 18,
        }}
      >
        {TASKS.map((task, i) => {
          const start = stagger(24, i, 11);
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <Card
              key={task.t}
              style={{
                width: 372,
                height: 176,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 28}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <StepNo n={i + 1} color={task.color} bg={task.bg} size={30} />
                <span style={{ fontFamily: F.sans, fontSize: 24, fontWeight: 900, color: C.ink }}>
                  {task.t}
                </span>
              </div>
              <div style={{ marginTop: 14, fontFamily: F.sans, fontSize: 15.5, lineHeight: 1.65, color: C.ink2 }}>
                {task.s}
              </div>
              <div style={{ marginTop: "auto", height: 3, borderRadius: 2, backgroundColor: task.bg }}>
                <div style={{ width: 46, height: 3, borderRadius: 2, backgroundColor: task.color }} />
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
          top: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.78)",
          border: `1px dashed ${C.accentLine}`,
          fontFamily: F.sans,
          ...rise(frame, 70, 12, 16),
        }}
      >
        <span style={{ fontSize: 15, color: C.ink2 }}>
          <span style={{ fontWeight: 900, color: C.accent }}>怎么写 SKILL.md</span>
          不在本讲范围内 —— 见课后材料
        </span>
        <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 2, color: C.muted }}>
          NEXT · 课后材料
        </span>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};