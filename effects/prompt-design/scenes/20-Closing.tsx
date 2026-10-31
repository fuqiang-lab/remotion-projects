import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  ChalkCircle,
  ChalkLine,
  Desk,
  SceneFrame,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";

/** 20 收尾：AI 生成内容 | 教学判断，白线一笔划开 */
export const ClosingScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  // 口播约 9.4s：前半句 0–4s，后半句 4–8s，末句 8s 后收束
  const slash = voStart + 16;
  const highlight = voStart + Math.round(4.4 * fps);
  const teacher = voStart + Math.round(5.2 * fps);
  const sign = voStart + Math.round(8.0 * fps);

  const draw = spring({ frame: frame - teacher, fps, config: { damping: 14, mass: 0.7 } });

  return (
    <SceneFrame>
      <Desk>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 110,
            textAlign: "center",
            fontFamily: F.sans,
            ...rise(frame, 4, 14, 16),
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 6, color: C.accent }}>
            收束 · 全课由此收尾
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 184,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 46,
            fontFamily: F.sans,
          }}
        >
          <div style={{ textAlign: "right", ...rise(frame, voStart, 20, 18) }}>
            <div style={{ fontSize: 21, fontWeight: 700, color: C.muted, marginBottom: 8 }}>AI</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.fg2 }}>可以生成内容</div>
          </div>

          {/* 分隔线 */}
          <div
            style={{
              width: 2,
              height: 150 * clamp((frame - slash) / 12, 0, 1),
              backgroundColor: C.line2,
            }}
          />

          <div style={{ position: "relative", ...rise(frame, voStart + 8, 20, 18) }}>
            <div style={{ fontSize: 21, fontWeight: 700, color: C.accent, marginBottom: 8 }}>
              教师
            </div>
            <div
              style={{
                position: "relative",
                fontSize: 44,
                fontWeight: 900,
                color: C.fg,
                whiteSpace: "nowrap",
              }}
            >
              教学判断永远在这一端
              {frame >= teacher ? (
                <div style={{ position: "absolute", left: -6, top: -14 }}>
                  <ChalkCircle
                    width={Math.round(44 * 8.6)}
                    height={64}
                    start={teacher}
                    duration={16}
                    color={C.chalk}
                    stroke={3}
                  />
                </div>
              ) : null}
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 74,
                fontFamily: F.sans,
                fontSize: 13,
                color: C.muted,
                opacity: clamp((frame - highlight) / 10, 0, 1) * 0.4,
              }}
            >
              {""}
            </div>
          </div>
        </div>

        {/* 手绘白线：一笔横向划开 */}
        <ChalkLine x={[96, 1184]} y={[300, 292]} start={slash} thickness={6} />
        <ChalkLine x={[1010, 1186]} y={[364, 352]} start={slash + 6} thickness={5} />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 392,
            display: "flex",
            justifyContent: "center",
            opacity: clamp((frame - sign) / 14, 0, 1),
            scale: String(0.96 + 0.04 * draw),
            fontFamily: F.sans,
            fontSize: 17,
            color: C.fg2,
            fontWeight: 600,
          }}
        >
          它干重复的活，你干要紧的判断 —— 这就是“会问 AI”到“会给 Agent 派活”的分界线。
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 446,
            textAlign: "center",
            fontFamily: F.sans,
            ...rise(frame, sign + 4, 10, 14),
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: C.muted,
              letterSpacing: 1,
            }}
          >
            主讲：付强 · 天津职业技术师范大学 经济与管理学院  |  谢谢大家 · 答疑 3—5 分钟
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};