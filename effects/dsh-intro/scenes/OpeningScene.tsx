import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Nav, SceneFrame } from "../ui";

/** 01 开场：一句“它是什么” + 先把字幕亮出来，再接同名标题 */
export const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const markScale = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={null} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${Math.round(frame * 0.04)}px)`,
          marginTop: -26,
        }}
      >
        {/* 图腾：四个方块拼成的 D 字雏形 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 18px)",
            gap: 8,
            marginBottom: 30,
            scale: String(markScale),
            rotate: `${(1 - markScale) * -12}deg`,
          }}
        >
          {[C.ink, C.accent, C.ink, C.line].map((bg, i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                backgroundColor: bg,
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontFamily: F.sans,
            fontSize: 36,
            fontWeight: 500,
            color: C.ink2,
            letterSpacing: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 10,
            ...rise(frame, 6, 16, 16),
          }}
        >
          <span>一个会用</span>
          <span style={{ backgroundColor: C.accentSoft, color: C.accent, padding: "2px 12px", borderRadius: 6 }}>
            工具
          </span>
          <span>也会</span>
          <span style={{ backgroundColor: C.blueSoft, color: C.blue, padding: "2px 12px", borderRadius: 6 }}>
            记笔记
          </span>
          <span>的</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 20,
            marginTop: 10,
            whiteSpace: "nowrap",
            ...rise(frame, 12, 26, 20),
          }}
        >
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 86,
              fontWeight: 900,
              letterSpacing: -2.6,
              color: C.ink,
              lineHeight: 1.05,
            }}
          >
            DeepSeek Harness
          </span>
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 66,
              fontWeight: 900,
              color: C.accent,
              letterSpacing: -1,
            }}
          >
            简介
          </span>
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: 5,
            color: C.muted,
            ...rise(frame, 24, 12, 16),
          }}
        >
          DEEPSEEK HARNESS · 一个跑在终端里的智能体
        </div>
      </div>

      <CaptionPill
        text="它到底是什么？两分钟你就明白了"
        start={52}
        width={640}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 34,
          fontFamily: F.mono,
          fontSize: 12,
          letterSpacing: 2,
          color: C.muted,
          opacity: Math.min(1, Math.max(0, (durationInFrames - 40 - frame) / 20)),
        }}
      >
        01 / 11
      </div>
    </SceneFrame>
  );
};