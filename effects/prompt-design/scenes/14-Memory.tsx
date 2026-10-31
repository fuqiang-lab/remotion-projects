import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Desk,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

/** 14 记忆三层：一张桌子 + 三个由内向外扩散的抽屉 */
export const MemoryLayersScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const s1 = voStart + Math.round(1.2 * fps);
  const s2 = voStart + Math.round(3.0 * fps);
  const s3 = voStart + Math.round(4.9 * fps);
  const note = voStart + Math.round(7.2 * fps);

  const layers = [
    {
      key: "1",
      t: "工作记忆",
      d: "这次对话 · 桌面摊开的（短期）",
      inset: 0,
      color: C.accent,
      soft: "rgba(226,114,74,0.14)",
      start: s1,
    },
    {
      key: "2",
      t: "长期记忆",
      d: "你的偏好 · 贴好标签的档案卡",
      inset: 74,
      color: C.blue,
      soft: "rgba(108,140,240,0.12)",
      start: s2,
    },
    {
      key: "3",
      t: "向量记忆",
      d: "按意思召回 · 大档案柜",
      inset: 148,
      color: C.green,
      soft: "rgba(75,192,138,0.10)",
      start: s3,
    },
  ];

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={3}
          chapters={CHAPTERS}
          label="06 · 记忆"
          title="一张桌子 + 三个抽屉"
          accent="三个抽屉"
        />

        {/* 右侧同心层 */}
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 196,
            width: 620,
            height: 320,
          }}
        >
          {layers.map((l, i) => {
            const on = clamp((frame - l.start) / 16, 0, 1);
            return (
              <div
                key={l.key}
                style={{
                  position: "absolute",
                  inset: 0,
                  left: l.inset,
                  right: l.inset,
                  top: l.inset * 0.5,
                  bottom: l.inset * 0.5,
                  borderRadius: 18,
                  backgroundColor: l.soft,
                  border: `1.5px solid ${l.color}`,
                  opacity: on,
                  scale: String(0.94 + 0.06 * on),
                  boxShadow: `inset 0 0 40px rgba(0,0,0,0.18)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    top: 12,
                    fontFamily: F.sans,
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: l.color,
                  }}
                >
                  {l.t}
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    bottom: 12,
                    fontFamily: F.mono,
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: 1.5,
                  }}
                >
                  {i === 0 ? "THIS TASK" : i === 1 ? "PREFERENCE" : "RETRIEVAL"}
                </div>
              </div>
            );
          })}
        </div>

        {/* 左侧：三层说明 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 500,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {layers.map((l) => {
            const on = frame >= l.start;
            return (
              <div
                key={l.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: on ? "rgba(255,255,255,0.04)" : "transparent",
                  border: `1px solid ${on ? C.line : "transparent"}`,
                  ...rise(frame, l.start - 6, 12, 12),
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 18,
                    fontWeight: 500,
                    color: l.color,
                    width: 16,
                  }}
                >
                  {l.key}
                </span>
                <div style={{ fontFamily: F.sans }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: C.fg }}>{l.t}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>{l.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 486,
            width: 1152,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: F.sans,
            ...rise(frame, note, 12, 14),
          }}
        >
          <span style={{ fontSize: 14, color: C.muted }}>
            越往外：容量越大、越省桌面 · 记忆不是 LLM 自带，是 Harness 在模型外面做的
          </span>
          <span style={{ fontSize: 15, fontWeight: 900, color: C.fg }}>
            交代一次 → 记成文件 → <span style={{ color: C.accent }}>下次自动生效</span>
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};