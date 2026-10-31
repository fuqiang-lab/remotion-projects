import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, L, rise, stagger } from "../theme";
import { CaptionPill, Card, SceneFrame, SceneTitle } from "../ui";

const STEPS = [
  { k: "写文案", v: "一屏一句", color: C.ink, bg: "#EFEDF3" },
  { k: "配色", v: "橙只出现三次", color: C.accent, bg: C.accentSoft },
  { k: "配图", v: "白卡 + 淡蓝地台", color: C.blue, bg: C.blueSoft },
  { k: "对齐", v: "字幕带 124px", color: C.green, bg: C.greenSoft },
  { k: "验收", v: "lint 后导出", color: C.purple, bg: C.purpleSoft },
];

const BOX_W = 168;
const GAP = 74;
const TOTAL = STEPS.length * BOX_W + (STEPS.length - 1) * GAP;
const LEFT = (L.width - TOTAL) / 2;

/** 版式样本 3：流程图页（卡片 + 横向箭头） */
export const FlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrow = Math.min(1, Math.max(0, (frame - 40) / 36));

  return (
    <SceneFrame padBottom={L.captionBand}>
      <SceneTitle label="FLOW · 流程页" title="五个节点，一条箭头走完" accent="一条箭头" />

      <div style={{ position: "absolute", top: 300, left: 0, right: 0 }}>
        <svg width={L.width} height={60} style={{ position: "absolute", left: 0, top: 0 }}>
          {STEPS.slice(0, -1).map((_, i) => {
            const x1 = LEFT + (i + 1) * BOX_W + i * GAP + 8;
            const x2 = LEFT + (i + 1) * (BOX_W + GAP) - 8;
            const drawn = Math.min(1, Math.max(0, (arrow - i * 0.12) / 0.16));
            return (
              <g key={i} opacity={drawn}>
                <line x1={x1} y1={64} x2={x2} y2={64} stroke={C.line} strokeWidth={2} />
                <path
                  d={`M${x2 - 7} 59 L${x2} 64 L${x2 - 7} 69`}
                  stroke={C.muted}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </svg>

        <div style={{ position: "absolute", left: LEFT, top: 0, display: "flex", gap: GAP }}>
          {STEPS.map((s, i) => {
            const start = stagger(18, i, 8);
            const pop = spring({ frame: frame - start, fps, config: { damping: 15, mass: 0.7 } });
            return (
              <Card
                key={s.k}
                style={{
                  width: BOX_W,
                  height: 128,
                  padding: "18px 16px",
                  opacity: Math.min(1, Math.max(0, (frame - start) / 10)),
                  scale: String(0.86 + pop * 0.14),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      backgroundColor: s.bg,
                      color: s.color,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: F.mono,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontFamily: F.sans, fontSize: 19, fontWeight: 900, color: C.ink }}>
                    {s.k}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: F.sans,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: C.muted,
                  }}
                >
                  {s.v}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <CaptionPill text="每个节点一张卡，箭头负责讲清先后" start={44} />
      <div
        style={{
          position: "absolute",
          left: L.gutter,
          top: 500,
          fontFamily: F.sans,
          fontSize: 15,
          color: C.ink2,
          ...rise(frame, 90, 12, 16),
        }}
      >
        版式 5 / 6：<span style={{ color: C.accent, fontWeight: 800 }}>流程页</span>
        <span style={{ color: C.muted }}> · 5 节点 + 箭头，节奏靠错峰入场</span>
      </div>
    </SceneFrame>
  );
};