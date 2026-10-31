import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Nav, SceneFrame } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

/** 15 收尾：居中标题页 */
export const ClosingScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <SceneFrame>
      <Nav chapter={null} label="收尾" page={nav.page} total={nav.total} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -30,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 16px)",
            gap: 7,
            marginBottom: 26,
            scale: String(mark),
          }}
        >
          {[C.ink, C.accent, C.ink, C.line].map((bg, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: 5, backgroundColor: bg }} />
          ))}
        </div>

        <div
          style={{
            fontFamily: F.sans,
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: -1.2,
            color: C.ink,
            whiteSpace: "nowrap",
            ...rise(frame, 10, 22, 18),
          }}
        >
          谢谢，<span style={{ color: C.accent }}>有问题随时找我</span>
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: F.sans,
            fontSize: 18,
            color: C.ink2,
            ...rise(frame, 22, 14, 16),
          }}
        >
          问题与后续材料请联系培训组织方
        </div>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            gap: 10,
            ...rise(frame, 32, 12, 16),
          }}
        >
          {["是什么", "怎么加载", "装在哪", "怎么自查"].map((t, i) => (
            <span
              key={t}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: `1px solid ${i === 0 ? C.accentLine : C.line}`,
                backgroundColor: i === 0 ? C.accentSoft : "#FFFFFF",
                color: i === 0 ? C.accent : C.ink2,
                fontFamily: F.sans,
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {String(i + 1).padStart(2, "0")} {t}
            </span>
          ))}
        </div>
      </div>

      <CaptionPill text={line.text} start={36} width={860} />
    </SceneFrame>
  );
};