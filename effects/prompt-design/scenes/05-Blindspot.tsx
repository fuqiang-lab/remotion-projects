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

/** 左上：通用知识（它早就学过） */
const KNOWN = ["古诗词", "法律常识", "教学设计通用模型", "常见软件操作"];
/** 右下：你校学情（它从没看过） */
const UNKNOWN = ["高二电商 3 班", "本学期实训安排", "手上这一版教材", "班级常见错误"];

/** 05 不负责当下：两个圆——通用的"聪明" ∩ 你的班级 = ∅ */
export const BlindspotScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const knowStart = voStart + 10;
  const unkStart = voStart + Math.round(3.4 * fps);
  const fixStart = voStart + Math.round(6.6 * fps);
  const gapPulse = clamp((frame - (unkStart + 20)) / 16, 0, 1);

  // 两圆错开但不重叠，中间标注"补不了"
  const cx1 = 360;
  const cy1 = 336;
  const r1 = 118;
  const cx2 = 900;
  const cy2 = 336;
  const r2 = 118;

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={0}
          chapters={CHAPTERS}
          label="01 · 什么是 LLM"
          title="后果二：它不知道“当下”和“你的班级”"
          accent="“当下”和“你的班级”"
        />

        <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
          <circle
            cx={cx1}
            cy={cy1}
            r={r1}
            fill="rgba(108,140,240,0.10)"
            stroke={C.blue}
            strokeWidth={2}
            strokeDasharray={2 * Math.PI * r1}
            strokeDashoffset={2 * Math.PI * r1 * (1 - clamp((frame - knowStart) / 18, 0, 1))}
          />
          <circle
            cx={cx2}
            cy={cy2}
            r={r2}
            fill="rgba(226,114,74,0.10)"
            stroke={C.accent}
            strokeWidth={2}
            strokeDasharray={2 * Math.PI * r2}
            strokeDashoffset={2 * Math.PI * r2 * (1 - clamp((frame - unkStart) / 18, 0, 1))}
          />
          {/* 两圆之间的虚线：没有交集 */}
          <line
            x1={cx1 + r1 + 8}
            y1={cy1}
            x2={cx2 - r2 - 8}
            y2={cy2}
            stroke={C.muted}
            strokeWidth={1.5}
            strokeDasharray="5 6"
            opacity={clamp((frame - unkStart - 12) / 12, 0, 1) * 0.8}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: cx1 - 120,
            top: cy1 - 30,
            width: 240,
            textAlign: "center",
            fontFamily: F.sans,
            ...rise(frame, knowStart + 4, 10, 14),
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.blue }}>
            通用知识
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.fg, marginTop: 6 }}>
            它早就学过
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
            {KNOWN.slice(0, 3).join(" · ")}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: cx2 - 120,
            top: cy2 - 30,
            width: 240,
            textAlign: "center",
            fontFamily: F.sans,
            ...rise(frame, unkStart + 4, 10, 14),
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.accent }}>
            你校学情
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.fg, marginTop: 6 }}>
            它从没看过
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
            {UNKNOWN.slice(0, 3).join(" · ")}
          </div>
        </div>

        {/* 中间：交集为空 */}
        <div
          style={{
            position: "absolute",
            left: 590,
            top: 318,
            width: 100,
            textAlign: "center",
            fontFamily: F.mono,
            fontSize: 13,
            color: C.fg2,
            opacity: clamp((frame - unkStart - 12) / 12, 0, 1),
          }}
        >
          A ∩ B
          <div style={{ fontSize: 26, fontWeight: 700, color: C.fg, marginTop: 4 }}>∅</div>
        </div>

        {/* 它知道的知识截止日 */}
        <Card
          style={{
            position: "absolute",
            left: 64,
            top: 494,
            width: 520,
            height: 84,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 20px",
            ...rise(frame, knowStart + 16, 12, 14),
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              letterSpacing: 1.5,
              color: C.muted,
              width: 52,
            }}
          >
            KNOWLEDGE
          </span>
          <div style={{ fontFamily: F.sans }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.fg }}>停在训练结束那一天</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
              这学期的实训安排、手上的教材版本，它都不知道
            </div>
          </div>
        </Card>

        {/* 三项补救：与本课后续章节呼应 */}
        <div
          style={{
            position: "absolute",
            right: 64,
            top: 494,
            display: "flex",
            gap: 10,
            ...rise(frame, fixStart, 12, 16),
          }}
        >
          {["上下文", "记忆", "知识库 / RAG"].map((t, i) => (
            <span
              key={t}
              style={{
                fontFamily: F.sans,
                fontSize: 13,
                fontWeight: 800,
                color: C.fg,
                padding: "9px 14px",
                borderRadius: 8,
                backgroundColor: C.greenSoft,
                border: `1px solid ${C.green}`,
                opacity: clamp((frame - fixStart - i * 8) / 10, 0, 1) * (0.65 + 0.35 * gapPulse),
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              alignSelf: "center",
              fontFamily: F.sans,
              fontSize: 12.5,
              color: C.muted,
              marginLeft: 4,
            }}
          >
            ← 都在补这件事
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};