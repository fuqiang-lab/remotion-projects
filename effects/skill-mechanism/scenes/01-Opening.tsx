import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Nav, SceneFrame } from "../ui";
import type { NavSeed, SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

/** 01 开场：居中标题页，四块小方块拼成「能力包」的意象 */
export const OpeningScene: React.FC<SceneProps & { nav: NavSeed }> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={null} label="开场" page={nav.page} total={nav.total} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -34,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 18px)",
            gap: 8,
            marginBottom: 28,
            scale: String(mark),
            rotate: `${(1 - mark) * -12}deg`,
          }}
        >
          {[C.ink, C.accent, C.ink, C.line].map((bg, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: bg }} />
          ))}
        </div>

        <div
          style={{
            fontFamily: F.mono,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 6,
            color: C.muted,
            marginBottom: 16,
            ...rise(frame, 6, 12, 16),
          }}
        >
          AI 赋能教学创新 · 工具、方法与案例
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            whiteSpace: "nowrap",
            ...rise(frame, 12, 26, 20),
          }}
        >
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: -2.6,
              color: C.ink,
              lineHeight: 1.05,
            }}
          >
            Skill
          </span>
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 64,
              fontWeight: 900,
              color: C.accent,
              letterSpacing: -1,
            }}
          >
            的机制与安装
          </span>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: F.sans,
            fontSize: 22,
            fontWeight: 500,
            color: C.ink2,
            ...rise(frame, 26, 14, 16),
          }}
        >
          <span>从「每次重写提示词」</span>
          <span style={{ color: C.accent, fontWeight: 800 }}>→</span>
          <span>到「装一个能力包」</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 34,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: F.mono,
          fontSize: 12,
          letterSpacing: 2,
          color: C.muted,
          ...rise(frame, 34, 10, 14),
        }}
      >
        <span>10 分钟速览</span>
        <span style={{ color: C.line }}>|</span>
        <span>通用口径，适用于常见 Agent 工具</span>
      </div>

      <CaptionPill text={line.text} start={40} width={960} />
    </SceneFrame>
  );
};