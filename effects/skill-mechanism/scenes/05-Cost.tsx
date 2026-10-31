import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { progress, rise } from "../theme-helpers";

const SIDE_EFFECTS = [
  { t: "上下文被占满", s: "真正要处理的材料被挤出窗口", color: C.accent, bg: C.accentSoft, line: C.accentLine },
  { t: "每次请求都在付费", s: "token 成本按每轮重复计", color: C.blue, bg: C.blueSoft, line: C.blueLine },
  { t: "注意力被稀释", s: "指令越多，越容易漏看关键约束", color: C.purple, bg: C.purpleSoft, line: C.purpleLine },
];

/** 05 为什么不能一次全读进来：三条代价 → 换解法 */
export const CostScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fill = progress(frame, 26, 78);
  const overflow = progress(frame, 50, 74);

  return (
    <SceneFrame>
      <Nav chapter={1} label="怎么加载" page={nav.page} total={nav.total} />
      <SceneTitle
        label="WHY · 动机"
        title="为什么不能一次全读进来"
        accent="一次全读进来"
      />

      <div style={{ position: "absolute", left: 64, top: 212, width: 300 }}>
        <Card style={{ padding: "20px 22px", ...rise(frame, 14, 20, 18) }}>
          <div style={{ fontFamily: F.mono, fontSize: 11.5, letterSpacing: 2, color: C.muted }}>
            CONTEXT WINDOW
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: F.sans,
              fontSize: 34,
              fontWeight: 900,
              color: C.ink,
              letterSpacing: -1,
            }}
          >
            20 <span style={{ fontSize: 17, fontWeight: 700, color: C.muted }}>个 Skill</span>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 13, color: C.muted, marginTop: 2 }}>
            每个 3000 字正文与参考
          </div>

          <div
            style={{
              marginTop: 16,
              height: 92,
              borderRadius: 10,
              border: `1px solid ${C.line}`,
              backgroundColor: "#FAFAFD",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 20,
                  margin: "0 8px 4px",
                  borderRadius: 5,
                  backgroundColor: i === 3 ? C.accent : "rgba(224,108,60,0.28)",
                  opacity: interpolate(fill, [i * 0.2, i * 0.2 + 0.2], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  translate: `0px ${interpolate(fill, [i * 0.2, i * 0.2 + 0.2], [14, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: F.sans,
              fontSize: 12.5,
              fontWeight: 700,
              color: C.accent,
              opacity: overflow,
            }}
          >
            <span>▲</span>
            <span>要处理的材料被挤出窗口</span>
          </div>
        </Card>
      </div>

      <div
        style={{
          position: "absolute",
          left: 396,
          width: 24,
          top: 300,
          display: "grid",
          placeItems: "center",
          fontFamily: F.mono,
          fontSize: 20,
          color: C.muted,
          opacity: Math.min(1, Math.max(0, (frame - 40) / 12)),
        }}
      >
        →
      </div>

      <div style={{ position: "absolute", left: 440, right: 64, top: 212 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {SIDE_EFFECTS.map((x, i) => {
            const start = 30 + i * 10;
            const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
            return (
              <Card
                key={x.t}
                style={{
                  flex: 1,
                  height: 170,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                  translate: `0px ${(1 - pop) * 24}px`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: x.bg,
                    border: `1px solid ${x.line}`,
                    color: x.color,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: F.mono,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  0{i + 1}
                </div>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: 19, fontWeight: 900, color: C.ink, lineHeight: 1.3 }}>
                    {x.t}
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 13, color: C.body2, marginTop: 6, lineHeight: 1.5 }}>
                    {x.s}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            padding: "16px 20px",
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${C.accentLine}`,
            boxShadow: "0 2px 4px rgba(20,24,31,0.03), 0 14px 34px rgba(20,24,31,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            ...rise(frame, 66, 16, 18),
          }}
        >
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#FFFFFF",
              backgroundColor: C.accent,
              padding: "6px 12px",
              borderRadius: 7,
            }}
          >
            解法
          </span>
          <div style={{ fontFamily: F.sans, fontSize: 18.5, color: C.ink, lineHeight: 1.45 }}>
            不是「少装」，而是
            <span style={{ fontWeight: 900, color: C.accent }}>「先不读正文」</span>
            <span style={{ color: C.muted, fontSize: 15, marginLeft: 10 }}>→ 这就是下一节的渐进加载</span>
          </div>
        </div>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};