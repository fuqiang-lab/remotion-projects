import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Card,
  Desk,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

/** 环上的四个节点（顺时针） */
const NODES = [
  { t: "模型推理", d: "想下一步做什么" },
  { t: "调用工具", d: "读文件、跑脚本、查资料" },
  { t: "观察结果", d: "看工具到底返回了什么" },
  { t: "判断完成", d: "没完成 → 再来一轮" },
];

/** 11 循环：Agent 的四步环 + 转角处的箭头，转三圈后在"完成"处分叉 */
export const LoopScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const ringStart = voStart + 12;
  // 口播约 11s：每 1.9s 点亮一个节点
  const nodeStart = (i: number) => voStart + Math.round((1.2 + i * 1.9) * fps);
  const doneStart = voStart + Math.round(8.6 * fps);

  const cx = 400;
  const cy = 360;
  const rx = 206;
  const ry = 118;
  const diameter = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  const draw = clamp((frame - ringStart) / 26, 0, 1);

  // 绕环跑的光点：只在"没完成"时循环，最后停在"判断完成"
  const loopFrame = frame - ringStart - 14;
  const lap = 2 * 1.6 * fps; // 一圈帧数
  const t = loopFrame > 0 ? (loopFrame % lap) / lap : 0;
  const angle = -Math.PI / 2 + t * Math.PI * 2;
  const lightX = cx + rx * Math.cos(angle);
  const lightY = cy + ry * Math.sin(angle);
  const running = frame > ringStart + 14 && frame < doneStart;

  const pos = (i: number) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    return { left: cx + rx * Math.cos(a), top: cy + ry * Math.sin(a) };
  };

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={2}
          chapters={CHAPTERS}
          label="04 · Agent 与 Harness"
          title="本质区别只有一件事：有没有“循环”"
          accent="“循环”"
        />

        {/* 左：对照句 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 226,
            width: 340,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Card style={{ padding: "14px 16px", ...rise(frame, voStart, 14, 14) }}>
            <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 2 }}>
              LLM
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 15.5, color: C.fg2, marginTop: 8, lineHeight: 1.7 }}>
              你问一句 → 它答一句 → 结束。
            </div>
          </Card>
          <Card
            style={{
              padding: "14px 16px",
              borderColor: C.accentLine,
              backgroundColor: C.accentSoft,
              ...rise(frame, voStart + 10, 14, 14),
            }}
          >
            <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, color: C.accent, letterSpacing: 2 }}>
              AGENT
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 15.5, color: C.fg, marginTop: 8, lineHeight: 1.7 }}>
              做一步 → 看结果 → 再决定下一步。
            </div>
          </Card>
          <div
            style={{
              marginTop: 6,
              fontFamily: F.sans,
              fontSize: 12.5,
              lineHeight: 1.7,
              color: C.muted,
              ...rise(frame, voStart + 20, 10, 14),
            }}
          >
            工具 + 循环 + 能记住中间状态，
            <br />
            才从“单次文字接龙”升级为执行者。
          </div>
        </div>

        {/* 右：环形流程 */}
        <svg
          width={1280}
          height={720}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <ellipse
            cx={cx + 300}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={C.line2}
            strokeWidth={2}
            strokeDasharray={`${diameter}`}
            strokeDashoffset={diameter * (1 - draw)}
            transform={`rotate(0 ${cx + 300} ${cy})`}
          />
          {/* 四个转角箭头（顺时针方向） */}
          {[0, 1, 2, 3].map((i) => {
            const a = -Math.PI / 2 + (i * Math.PI) / 2 + Math.PI / 8;
            const px = cx + 300 + rx * Math.cos(a);
            const py = cy + ry * Math.sin(a);
            const deg = (a * 180) / Math.PI + 90;
            const on = frame >= nodeStart(i) - 6;
            return (
              <polygon
                key={i}
                points="-6,-7 8,0 -6,7"
                fill={on ? C.accent : C.line2}
                transform={`translate(${px} ${py}) rotate(${deg})`}
                opacity={draw}
              />
            );
          })}
          {running ? (
            <circle cx={lightX + 300} cy={lightY} r={7} fill={C.accent}>
              <animate
                attributeName="opacity"
                values="1;0.55;1"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
          ) : null}
          {/* 完成后的分叉：向右出环 */}
          <line
            x1={cx + 300 + rx}
            y1={cy}
            x2={cx + 300 + rx + 74 * clamp((frame - doneStart) / 14, 0, 1)}
            y2={cy}
            stroke={C.green}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeDasharray="6 6"
          />
        </svg>

        {NODES.map((n, i) => {
          const p = pos(i);
          const st = nodeStart(i);
          const on = frame >= st;
          return (
            <div
              key={n.t}
              style={{
                position: "absolute",
                left: p.left + 300 - 74,
                top: p.top - 30,
                width: 148,
                height: 60,
                borderRadius: 10,
                backgroundColor: on ? C.accentSoft : C.card,
                border: `1px solid ${on ? C.accent : C.line}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                boxShadow: on ? `0 0 0 4px rgba(226,114,74,0.08)` : "none",
                opacity: clamp((frame - ringStart) / 12, 0, 1),
                scale: String(on ? 1.03 : 1),
                fontFamily: F.sans,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 900, color: on ? C.fg : C.fg2 }}>
                {n.t}
              </span>
              <span style={{ fontSize: 10.5, color: on ? C.fg2 : C.muted }}>{n.d}</span>
            </div>
          );
        })}

        {/* 中心：轮次计数 */}
        <div
          style={{
            position: "absolute",
            left: cx + 300 - 60,
            top: cy - 30,
            width: 120,
            textAlign: "center",
            fontFamily: F.mono,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 500, color: C.fg }}>
            {String(Math.max(0, Math.min(3, Math.floor((frame - ringStart - 14) / (1.6 * fps)))) + 1).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, marginTop: 2 }}>ROUND</div>
        </div>

        {/* 完成分支的终点 */}
        <div
          style={{
            position: "absolute",
            left: cx + 300 + rx + 78,
            top: cy - 18,
            width: 108,
            height: 36,
            borderRadius: 8,
            backgroundColor: C.greenSoft,
            border: `1px solid ${C.green}`,
            display: "grid",
            placeItems: "center",
            fontFamily: F.sans,
            fontSize: 13,
            fontWeight: 800,
            color: C.fg,
            opacity: clamp((frame - doneStart - 8) / 10, 0, 1),
            translate: `${(1 - clamp((frame - doneStart - 8) / 12, 0, 1)) * -10}px 0`,
          }}
        >
          汇报结果 ✓
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};

/** 给 LoopScene 用的小工具：环上某点的位置（保留导出，便于其它场景复用） */
export const ringPoint = (cx: number, cy: number, rx: number, ry: number, t: number) => {
  const a = -Math.PI / 2 + t * Math.PI * 2;
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), deg: interpolate(t, [0, 1], [0, 360]) };
};