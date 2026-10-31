import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Desk, SceneFrame, pop } from "../../../styles/dark-desk";
import { C, F, L, clampOpt, rise } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";

/** 01 开场：两张"同一任务、不同派法"的提示纸条相互拉开，中间劈出一道裂缝 */
export const OpeningScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const split = spring({ frame: frame - 24, fps, config: { damping: 16, mass: 0.8 } });
  const gap = 30 * split;
  const crack = interpolate(frame, [26, 44], [0, 1], clampOpt);
  const badge = pop(frame, fps, 58, 14, 0.6);

  const note = (
    side: "left" | "right",
    text: string,
    tone: "muted" | "accent",
    start: number,
  ) => (
    <div
      style={{
        position: "absolute",
        top: 214,
        [side]: L.gutter + (side === "left" ? -gap : -gap),
        width: 470,
        minHeight: 210,
        padding: "22px 24px",
        borderRadius: 12,
        backgroundColor: tone === "accent" ? "#2B211D" : C.card,
        border: `1px solid ${tone === "accent" ? C.accentLine : C.line}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
        fontFamily: F.sans,
        ...rise(frame, start, 22, 16),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 2,
          color: tone === "accent" ? C.accent : C.muted,
        }}
      >
        {tone === "accent" ? "V2 · 会派活" : "V1 · 随口一问"}
      </div>
      <div
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: tone === "accent" ? C.fg : C.fg2,
          fontWeight: tone === "accent" ? 600 : 400,
        }}
      >
        {text}
      </div>
      <div
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: tone === "accent" ? C.green : C.red,
          fontWeight: 700,
        }}
      >
        {tone === "accent" ? "✓ 能直接拿去改改就上课" : "× 看着完整，谁都能用"}
      </div>
    </div>
  );

  return (
    <SceneFrame padBottom={0}>
      <Desk>
        {/* 居中大标题 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 108,
            textAlign: "center",
            fontFamily: F.sans,
            ...rise(frame, 4, 16, 18),
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 6,
              color: C.accent,
              marginBottom: 10,
            }}
          >
            AI 赋能教学设计专题研修
          </div>
          <div style={{ fontSize: 46, fontWeight: 900, color: C.fg, letterSpacing: -0.5 }}>
            同一个任务，<span style={{ color: C.accent }}>不同提示词</span>
          </div>
        </div>

        {note(
          "left",
          "“帮我写一份《直播开场话术》的教案。”",
          "muted",
          12,
        )}
        {note(
          "right",
          "“我是中职电商专业教师，面向高二学生，为《直播开场话术》写一份 45 分钟教案……输出为表格。”",
          "accent",
          18,
        )}

        {/* 中间劈开的裂缝 */}
        <div
          style={{
            position: "absolute",
            left: L.width / 2 - 1,
            top: 200,
            width: 2,
            height: 250 * crack,
            background: `linear-gradient(180deg, transparent, ${C.accent} 20%, ${C.accent} 80%, transparent)`,
            opacity: 0.8,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            fontFamily: F.sans,
            fontSize: 17,
            fontWeight: 700,
            color: C.fg2,
            ...rise(frame, 64, 14, 16),
          }}
        >
          差距不在 AI 聪不聪明，在
          <span style={{ color: C.accent, margin: "0 6px" }}>你怎么派活</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 510,
            display: "flex",
            justifyContent: "center",
            ...badge,
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              letterSpacing: 2,
              color: C.muted,
              padding: "5px 12px",
              borderRadius: 999,
              border: `1px solid ${C.line2}`,
            }}
          >
            LLM → 提示词 → 上下文 → Agent → 人格·记忆·模式 → Skills·RAG → 用好
          </span>
        </div>

        <CaptionPill text={line.text} start={Math.round(0.6 * fps)} />
      </Desk>
    </SceneFrame>
  );
};