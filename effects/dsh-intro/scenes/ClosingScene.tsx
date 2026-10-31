import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Nav, SceneFrame } from "../ui";

/** 11 收尾 */
export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markScale = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={null} label="DeepSeek Harness" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -40,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 18px)",
            gap: 8,
            marginBottom: 30,
            scale: String(markScale),
            rotate: `${(1 - markScale) * 12}deg`,
          }}
        >
          {[C.ink, C.accent, C.ink, C.line].map((bg, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: bg }} />
          ))}
        </div>

        <div
          style={{
            fontFamily: F.sans,
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: -2.4,
            color: C.ink,
            ...rise(frame, 8, 24, 20),
          }}
        >
          DeepSeek <span style={{ color: C.accent }}>Harness</span>
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: 5,
            color: C.muted,
            ...rise(frame, 20, 12, 16),
          }}
        >
          DEEPSEEK HARNESS · 认识 DSH
        </div>

        <div
          style={{
            marginTop: 42,
            padding: "9px 22px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.8)",
            border: `1px solid ${C.line}`,
            fontFamily: F.sans,
            fontSize: 16,
            fontWeight: 600,
            color: C.ink2,
            ...rise(frame, 30, 12, 16),
          }}
        >
          还想深入哪一块？随时接着问
        </div>
      </div>

      <CaptionPill text="它是什么，你已经清楚了——接下来交给它干活" start={40} />
    </SceneFrame>
  );
};