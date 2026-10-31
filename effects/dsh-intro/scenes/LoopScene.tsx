import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle } from "../ui";

const STEPS = [
  { label: "你的目标", sub: "自然语言说清要什么", color: C.ink, bg: "#F1EFEA" },
  { label: "推理规划", sub: "拆步骤、定计划", color: C.blue, bg: C.blueSoft },
  { label: "调用工具", sub: "读文件 / 跑命令 / 搜索", color: C.accent, bg: C.accentSoft },
  { label: "检查结果", sub: "报错就修，不满意就改", color: C.purple, bg: C.purpleSoft },
  { label: "交付汇报", sub: "给你可验收的产物", color: C.green, bg: C.greenSoft },
];

const BOX_W = 168;
const GAP = 74;
const TOTAL = STEPS.length * BOX_W + (STEPS.length - 1) * GAP;
const LEFT = (1280 - TOTAL) / 2;

/** 04 核心能力：代理循环 */
export const LoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 高亮在工具调用的环上持续走一圈
  const cycle = Math.floor(interpolate(frame, [50, 240], [0, 8], clamp)) % STEPS.length;
  const arrowProgress = interpolate(frame, [40, 76], [0, 1], { ...clamp, easing: (t) => t });

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={1} />
      <SceneTitle
        label="LOOP · 核心能力"
        title="它凭什么能干活？代理循环"
        accent="代理循环"
      />

      <div style={{ position: "absolute", top: 296, left: 0, right: 0 }}>
        {/* 连线 */}
        <svg width="1280" height="120" style={{ position: "absolute", top: 0, left: 0 }}>
          {STEPS.slice(0, -1).map((_, i) => {
            const x1 = LEFT + (i + 1) * BOX_W + i * GAP + 8;
            const x2 = LEFT + (i + 1) * (BOX_W + GAP) - 8;
            const drawn = interpolate(arrowProgress, [i * 0.12, i * 0.12 + 0.16], [0, 1], clamp);
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

        {/* 五步卡片 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: LEFT,
            display: "flex",
            gap: GAP,
          }}
        >
          {STEPS.map((s, i) => {
            const start = 18 + i * 8;
            const pop = spring({ frame: frame - start, fps, config: { damping: 15, mass: 0.7 } });
            const active = i === cycle && frame > 50;
            return (
              <Card
                key={s.label}
                style={{
                  width: BOX_W,
                  height: 128,
                  padding: "18px 16px",
                  opacity: Math.min(1, Math.max(0, (frame - start) / 10)),
                  scale: String(interpolate(pop, [0, 1], [0.86, active ? 1.06 : 1])),
                  borderColor: active ? s.color : C.line,
                  borderWidth: active ? 2 : 1,
                  boxShadow: active
                    ? `0 12px 28px ${s.color}22, 0 0 0 4px ${s.bg}`
                    : undefined,
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
                    {s.label}
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
                  {s.sub}
                </div>
              </Card>
            );
          })}
        </div>

        {/* 回环箭头 */}
        <svg width="1280" height="120" style={{ position: "absolute", top: 0, left: 0 }}>
          {(() => {
            const startX = LEFT + TOTAL - BOX_W / 2;
            const endX = LEFT + BOX_W / 2;
            const yTop = 132;
            const yBottom = 196;
            const drawn = interpolate(frame, [64, 104], [0, 1], clamp);
            const len = 1280;
            return (
              <g opacity={drawn}>
                <path
                  d={`M${startX} ${yTop} V${yBottom} H${endX} V${yTop + 24}`}
                  stroke={C.accent}
                  strokeWidth={2.2}
                  fill="none"
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - drawn)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`M${endX - 6} ${yTop + 30} L${endX} ${yTop + 20} L${endX + 6} ${yTop + 30}`}
                  stroke={C.accent}
                  strokeWidth={2.2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={drawn}
                />
                <rect x={560} y={yBottom - 14} width={160} height={28} rx={14} fill={C.paper} />
                <text
                  x={640}
                  y={yBottom + 5}
                  textAnchor="middle"
                  fontFamily={F.sans}
                  fontSize={14}
                  fontWeight={700}
                  fill={C.accent}
                >
                  没达到目标就继续
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 536,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          ...rise(frame, 110, 16, 16),
        }}
      >
        {[
          { k: "规划", v: "先想清楚顺序，再动手", c: C.blue },
          { k: "执行", v: "每一步都有真实反馈", c: C.accent },
          { k: "纠错", v: "失败当作新信息继续", c: C.purple },
        ].map((x) => (
          <div
            key={x.k}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.72)",
              border: `1px solid ${C.line}`,
              fontFamily: F.sans,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 900, color: x.c }}>{x.k}</span>
            <span style={{ fontSize: 14, color: C.muted }}>{x.v}</span>
          </div>
        ))}
      </div>

      <CaptionPill text="不是一次性回答，而是一圈一圈往前推" start={56} />
    </SceneFrame>
  );
};