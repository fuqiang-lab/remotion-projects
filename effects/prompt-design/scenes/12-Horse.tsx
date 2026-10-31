import { useCurrentFrame, useVideoConfig } from "remotion";

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

/** 马具零件依次"咔"地装上 */
const PARTS = [
  { t: "工具调用", d: "做一步看一步的循环", x: 0.5, y: 0.12 },
  { t: "权限控制", d: "能做什么、不能做什么", x: 0.18, y: 0.52 },
  { t: "日志", d: "每一步都有记录", x: 0.82, y: 0.52 },
  { t: "中间结果", d: "记着已经跑到哪", x: 0.5, y: 0.84 },
];

/** 12 马与马具：裸马 → 装上马具 → 跑一趟活 */
export const HorseScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  // 口播约 11.8s：公式 → 裸马 → 马具逐个装上 → 跑活
  const formulaStart = voStart + 6;
  const bareStart = voStart + Math.round(1.4 * fps);
  const partStart = (i: number) => voStart + Math.round((3.0 + i * 1.7) * fps);
  const runStart = voStart + Math.round(9.6 * fps);

  // 马的一小步：装上马具后才开始往前挪
  const gait = Math.min(1, clamp((frame - runStart) / 24, 0, 1));
  const bob = Math.sin((frame - runStart) / 3.2) * 3 * gait;

  const hx = 120;
  const hy = 268 + bob;
  const hw = 300;
  const hh = 150;

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={2}
          chapters={CHAPTERS}
          label="04 · Agent 与 Harness"
          title="Agent ＝ 模型（马）＋ 马具（Harness）"
          accent="马具（Harness）"
        />

        {/* 公式 */}
        <Card
          style={{
            position: "absolute",
            left: 64,
            top: 200,
            width: 560,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: F.sans,
            ...rise(frame, formulaStart, 12, 14),
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: C.fg }}>Agent</span>
          <span style={{ fontSize: 18, color: C.muted }}>=</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.blue }}>LLM</span>
          <span style={{ fontSize: 18, color: C.muted }}>+</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.accent }}>Harness</span>
        </Card>

        {/* 马（极简线描） */}
        <svg
          width={1280}
          height={720}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          opacity={clamp((frame - bareStart) / 14, 0, 1)}
        >
          <g transform={`translate(${hx} ${hy})`}>
            {/* 躯干 */}
            <rect
              x={40}
              y={30}
              width={hw - 80}
              height={hh - 60}
              rx={36}
              fill="rgba(108,140,240,0.10)"
              stroke={C.blue}
              strokeWidth={2.5}
            />
            {/* 脖子 + 头 */}
            <path
              d={`M ${hw - 46} ${hh - 60} L ${hw + 4} ${2} L ${hw + 44} ${10} L ${hw - 10} ${hh - 46} Z`}
              fill="rgba(108,140,240,0.10)"
              stroke={C.blue}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {/* 鬃毛 */}
            <path
              d={`M ${hw - 8} ${10} Q ${hw - 30} ${26} ${hw - 40} ${hh - 60}`}
              fill="none"
              stroke={C.blue}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* 腿（跑起来时交替） */}
            {[60, hw - 110].map((lx, i) => {
              const swing = gait * Math.sin((frame - runStart) / 3.2 + i * Math.PI) * 10;
              return (
                <line
                  key={lx}
                  x1={lx}
                  y1={hh - 34}
                  x2={lx + swing}
                  y2={hh + 46}
                  stroke={C.blue}
                  strokeWidth={9}
                  strokeLinecap="round"
                />
              );
            })}
            {/* 尾巴 */}
            <path
              d={`M ${44} ${46} Q ${10} ${70} ${14} ${-6}`}
              fill="none"
              stroke={C.blue}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </g>

          {/* 马具：在马的坐标里画 */}
          <g transform={`translate(${hx} ${hy})`}>
            {PARTS.map((p, i) => {
              const st = partStart(i);
              const on = clamp((frame - st) / 10, 0, 1);
              const px = 24 + p.x * (hw + 20);
              const py = 6 + p.y * (hh + 20);
              return (
                <g key={p.t} opacity={on}>
                  <rect
                    x={px - 58}
                    y={py - 15}
                    width={116}
                    height={30}
                    rx={8}
                    fill="#2A211C"
                    stroke={C.accent}
                    strokeWidth={1.6}
                  />
                  <text
                    x={px}
                    y={py + 5}
                    textAnchor="middle"
                    fill={C.fg}
                    fontSize={13}
                    fontWeight={800}
                    fontFamily={F.sans}
                  >
                    {p.t}
                  </text>
                </g>
              );
            })}
            {/* 缰绳：从马头连到右侧"人"手 */}
            <path
              d={`M ${hw + 26} ${14} Q ${hw + 120} ${60} ${hw + 150} ${Math.min(190, 60 + gait * 40)}`}
              fill="none"
              stroke={C.accent}
              strokeWidth={2.2}
              strokeDasharray="5 5"
              opacity={clamp((frame - partStart(0)) / 12, 0, 1)}
            />
          </g>
        </svg>

        {/* 右：零件说明（与图同步点亮） */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 286,
            width: 516,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {PARTS.map((p, i) => {
            const on = frame >= partStart(i);
            return (
              <div
                key={p.t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 50,
                  padding: "0 14px",
                  borderRadius: 8,
                  backgroundColor: on ? C.accentSoft : "rgba(255,255,255,0.025)",
                  border: `1px solid ${on ? C.accentLine : C.line}`,
                  opacity: clamp((frame - partStart(i) + 6) / 10, 0, 1) || 0.55,
                  fontFamily: F.sans,
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.accent }}>
                  0{i + 1}
                </span>
                <span style={{ fontSize: 15, fontWeight: 900, color: C.fg, width: 76 }}>{p.t}</span>
                <span style={{ fontSize: 12.5, color: C.fg2 }}>{p.d}</span>
              </div>
            );
          })}
        </div>

        {/* 左右两句话 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 470,
            width: 560,
            fontFamily: F.sans,
            ...rise(frame, bareStart + 8, 12, 14),
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              color: C.blue,
            }}
          >
            裸马 · 力气大、跑得快
          </span>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>但拽不住、控不了方向</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 530,
            width: 596,
            fontFamily: F.sans,
            ...rise(frame, runStart, 12, 14),
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 800, color: C.fg }}>
            装上马具，力气才变成
            <span style={{ color: C.accent }}>能干的活</span>
          </span>
          <span style={{ fontSize: 12, color: C.muted, marginLeft: 10 }}>
            —— 派一趟活，它自己跑完
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};