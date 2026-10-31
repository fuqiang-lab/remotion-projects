import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { progress, rise } from "../theme-helpers";
import { CaptionPill, Card, L, Nav, SceneFrame, SceneTitle } from "../ui";
import type { SceneProps } from "../scenes-meta";

const STEPS = [
  {
    k: "选择安装位置",
    v: "全局装用户目录；只服务本项目就装到项目目录。选之前先决定这一条。",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    k: "复制整个 Skill 文件夹",
    v: "复制的是含 SKILL.md 的那一层，不是它的父文件夹。同名已存在的先备份。",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
  {
    k: "刷新并确认生效",
    v: "多数工具会自动监测目录变化；若清单里没有，重启一次客户端。",
    color: C.green,
    bg: C.greenSoft,
    line: C.greenLine,
  },
];

const BOX_W = 296;
const GAP = 68;
const TOTAL = STEPS.length * BOX_W + (STEPS.length - 1) * GAP;
const LEFT = (L.width - TOTAL) / 2;
const ROW_TOP = 268;
const BOX_H = 186;

/** 11 安装三步：流程页（三节点 + 箭头 + 停留说明） */
export const ThreeStepsScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flow = progress(frame, 30, 84);

  return (
    <SceneFrame>
      <Nav chapter={2} label="装在哪" page={nav.page} total={nav.total} />
      <SceneTitle label="STEP · 安装三步" title="三步：选位置 → 复制 → 刷新" accent="三步" />

      <svg
        width={L.width}
        height={20}
        style={{ position: "absolute", left: 0, top: ROW_TOP + BOX_H / 2 - 10 }}
      >
        {STEPS.slice(0, -1).map((_, i) => {
          const x1 = LEFT + (i + 1) * BOX_W + i * GAP + 10;
          const x2 = LEFT + (i + 1) * (BOX_W + GAP) - 10;
          const drawn = Math.min(1, Math.max(0, (flow - i * 0.35) / 0.3));
          return (
            <g key={i} opacity={drawn}>
              <line x1={x1} y1={10} x2={x2} y2={10} stroke={C.accentLine} strokeWidth={2} />
              <path
                d={`M${x2 - 8} 4 L${x2} 10 L${x2 - 8} 16`}
                stroke={C.accent}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>

      {STEPS.map((s, i) => {
        const start = 26 + i * 16;
        const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
        return (
          <Card
            key={s.k}
            style={{
              position: "absolute",
              left: LEFT + i * (BOX_W + GAP),
              top: ROW_TOP,
              width: BOX_W,
              height: BOX_H,
              padding: "20px 20px 18px",
              display: "flex",
              flexDirection: "column",
              opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
              translate: `0px ${(1 - pop) * 26}px`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: s.bg,
                  border: `1px solid ${s.line}`,
                  color: s.color,
                  fontFamily: F.mono,
                  fontSize: 15,
                  fontWeight: 700,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 2, color: C.muted }}>
                STEP {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: F.sans,
                fontSize: 21,
                fontWeight: 900,
                color: C.ink,
                lineHeight: 1.3,
              }}
            >
              {s.k}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: F.sans,
                fontSize: 13.5,
                lineHeight: 1.62,
                color: C.body2,
              }}
            >
              {s.v}
            </div>
          </Card>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: ROW_TOP + BOX_H + 34,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          ...rise(frame, 82, 12, 16),
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 18px",
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${C.line}`,
            fontFamily: F.sans,
            fontSize: 15,
            color: C.ink2,
            boxShadow: "0 2px 4px rgba(20,24,31,0.03), 0 10px 24px rgba(20,24,31,0.05)",
          }}
        >
          <span style={{ fontFamily: F.mono, fontSize: 12.5, color: C.accent }}>批量</span>
          用脚本复制更快
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 18px",
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${C.line}`,
            fontFamily: F.sans,
            fontSize: 15,
            color: C.ink2,
            boxShadow: "0 2px 4px rgba(20,24,31,0.03), 0 10px 24px rgba(20,24,31,0.05)",
          }}
        >
          <span style={{ fontFamily: F.mono, fontSize: 12.5, color: C.blue }}>手工</span>
          拖拽适合先试一个
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 206,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 14,
          color: C.muted,
          opacity: interpolate(frame, [18, 32], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        先决定作用域，再动手复制
      </div>

      <CaptionPill text={line.text} start={40} width={760} />
    </SceneFrame>
  );
};