import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Desk,
  Mark,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

const STEPS = [
  {
    no: "01",
    t: "定框架",
    d: "读课标与教材目录，输出「知识点—课时」映射表",
    check: "我检查：映射合不合理、有没有漏",
  },
  {
    no: "02",
    t: "列清单",
    d: "按映射表列出每单元「教案 + 课件 + 练习 + 评价」",
    check: "我检查：类型和数量合不合适",
  },
  {
    no: "03",
    t: "逐单元生成",
    d: "做完一个，验收一个 —— 别攒到最后一起看",
    check: "我验收：每个中间产物都能退回",
  },
  {
    no: "04",
    t: "一致性自查",
    d: "术语统一、覆盖课标，全部完成后终审",
    check: "我终审：可以退回重来",
  },
];

/** 18 拆成检查点：长任务拆成「生成一步 → 我检查一步」的链条 */
export const CheckpointsScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  // 口播约 11.7s：4 个检查点每 1.7s 一个，最后一句在 8.6s
  const stepStart = (i: number) => voStart + Math.round((0.6 + i * 1.7) * fps);
  const note = voStart + Math.round(8.6 * fps);
  const rail = clamp((frame - voStart - 8) / (3 * 1.7 * fps), 0, 1);

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={6}
          chapters={CHAPTERS}
          label="10 · 用好 Agent"
          title="长任务必须拆：拆成检查点链条"
          accent="检查点链条"
        />

        {/* 检查点链条 */}
        <div style={{ position: "absolute", left: 64, top: 214, width: 1152, height: 244 }}>
          {/* 主轨道 + 进度 */}
          <div
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top: 26,
              height: 2,
              backgroundColor: C.line,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 26,
              width: `${Math.min(1, rail) * 100}%`,
              height: 2,
              backgroundColor: C.accent,
            }}
          />

          {STEPS.map((s, i) => {
            const st = stepStart(i);
            const on = frame >= st;
            const x = (1152 - 52) * (i / (STEPS.length - 1) * 0.86 + 0.07);
            return (
              <div
                key={s.no}
                style={{
                  position: "absolute",
                  left: x - 140,
                  top: 0,
                  width: 280,
                  opacity: clamp((frame - st + 8) / 10, 0, 1) * 0.55 + (on ? 0.45 : 0),
                }}
              >
                {/* 节点 */}
                <div
                  style={{
                    position: "absolute",
                    left: 140 - 12,
                    top: 14,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    backgroundColor: on ? C.accent : C.bg2,
                    border: `2px solid ${on ? C.accent : C.line2}`,
                    boxShadow: on ? `0 0 0 5px ${C.accentSoft}` : "none",
                    zIndex: 2,
                  }}
                />
                {/* 卡片 */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 52,
                    width: 280,
                    height: 74 - i * 0,
                    borderRadius: 10,
                    padding: "10px 14px",
                    backgroundColor: C.card,
                    border: `1px solid ${on ? C.line2 : C.line}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: F.mono, fontSize: 11, color: C.accent }}>{s.no}</span>
                    <span style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 900, color: C.fg }}>
                      {s.t}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontFamily: F.sans,
                      fontSize: 11.5,
                      lineHeight: 1.5,
                      color: C.fg2,
                    }}
                  >
                    {s.d}
                  </div>
                </div>
                {/* 检查点（在轨道下方，表示"人"的介入） */}
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    top: 136,
                    width: 240,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: F.sans,
                    fontSize: 11.5,
                    color: on ? C.green : C.muted,
                  }}
                >
                  <Mark size={14} color={on ? C.green : C.line2} />
                  {s.check}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部：一句话 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: F.sans,
            ...rise(frame, note, 12, 14),
          }}
        >
          <span style={{ fontSize: 15, color: C.muted }}>每一步都有中间产物：</span>
          <span style={{ fontSize: 19, fontWeight: 900, color: C.fg }}>
            可看 · 可改 · <span style={{ color: C.accent }}>可退回</span>
          </span>
          <span style={{ width: 1, height: 18, backgroundColor: C.line2 }} />
          <span style={{ fontSize: 15, color: C.muted }}>
            拆解不是让 AI 慢下来，是让你在正确的位置保留判断权
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};