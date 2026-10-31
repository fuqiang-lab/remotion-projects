import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Card,
  Desk,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp, pop } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

const FILLS = [
  { k: "角色", v: "中职数控实训教师" },
  { k: "任务", v: "设计 45 分钟保养实训" },
  { k: "对象", v: "高一，没做过保养" },
  { k: "格式", v: "表格：环节—时间—评价" },
];

/** 06 派活单：一张纸条，信息越补越满 */
export const BriefScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const paperStart = voStart + 8;
  const slotBase = voStart + Math.round(1.8 * fps);
  const guessStart = voStart + Math.round(5.6 * fps);

  // 猜测气泡的数量随信息补齐而减少
  const slots = FILLS.map((_, i) => frame >= slotBase + i * 22);
  const filled = slots.filter(Boolean).length;
  const guesses = 9 - Math.round((9 * filled) / FILLS.length);
  const shake = clamp((frame - guessStart) / 30, 0, 1);

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={0}
          chapters={CHAPTERS}
          label="02 · 提示词"
          title="一条提示词，就是一张“派活单”"
          accent="“派活单”"
        />

        {/* 纸条 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 214,
            width: 640,
            height: 270,
            borderRadius: 10,
            backgroundColor: C.card,
            border: `1px solid ${C.line}`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            padding: "20px 22px",
            ...rise(frame, paperStart, 18, 16),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: F.mono,
              fontSize: 10.5,
              letterSpacing: 2,
              color: C.muted,
              borderBottom: `1px dashed ${C.line2}`,
              paddingBottom: 10,
            }}
          >
            <span>派活单 · WORK ORDER</span>
            <span>PROMPT</span>
          </div>

          <div
            style={{
              marginTop: 16,
              fontFamily: F.sans,
              fontSize: 19,
              fontWeight: 700,
              color: C.muted,
            }}
          >
            “帮我写一份《直播开场话术》的教案。”
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              gap: 9,
            }}
          >
            {FILLS.map((f, i) => {
              const on = slots[i];
              const s = pop(frame, fps, slotBase + i * 22, 14, 0.6);
              return (
                <div
                  key={f.k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: 34,
                    opacity: on ? s.opacity : 0.28,
                    scale: on ? s.scale : "1",
                  }}
                >
                  <span
                    style={{
                      fontFamily: F.sans,
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: on ? C.accent : C.muted,
                      width: 40,
                    }}
                  >
                    {f.k}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 30,
                      borderRadius: 6,
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: on ? C.accentSoft : "rgba(255,255,255,0.03)",
                      border: `1px ${on ? "solid" : "dashed"} ${on ? C.accentLine : C.line2}`,
                      fontFamily: F.sans,
                      fontSize: 14,
                      color: on ? C.fg : C.muted,
                    }}
                  >
                    {on ? f.v : "…… 没说"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右：AI 的"猜测空间" */}
        <div
          style={{
            position: "absolute",
            left: 744,
            top: 214,
            width: 472,
            ...rise(frame, paperStart + 10, 14, 16),
          }}
        >
          <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 800, color: C.fg2 }}>
            AI 需要猜的部分
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
              width: 400,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  border: `1px dashed ${i < guesses ? C.red : C.line}`,
                  backgroundColor: i < guesses ? C.redSoft : "transparent",
                  opacity: i < guesses ? 1 : 0.18,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: F.sans,
                  fontSize: 16,
                  fontWeight: 900,
                  color: C.red,
                }}
              >
                {i < guesses ? "?" : ""}
              </div>
            ))}
          </div>

          <Card
            style={{
              marginTop: 22,
              width: 400,
              padding: "14px 16px",
              backgroundColor: C.cardHi,
            }}
          >
            <div style={{ fontFamily: F.sans, fontSize: 13.5, lineHeight: 1.7, color: C.fg2 }}>
              你给的信息越少，它要猜的就越多；
              <br />
              <span style={{ color: C.red, fontWeight: 800 }}>你缺什么，它就替你编什么。</span>
            </div>
            <div
              style={{
                marginTop: 10,
                height: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(filled / FILLS.length) * 100}%`,
                  height: "100%",
                  backgroundColor: C.green,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: F.mono,
                fontSize: 10,
                color: C.muted,
                opacity: 0.4 + 0.6 * shake,
              }}
            >
              GUESS SPACE · {guesses}/9
            </div>
          </Card>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};