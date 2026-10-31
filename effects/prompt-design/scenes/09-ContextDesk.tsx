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

/** 桌面上的物品（自上而下堆叠，满了就挤掉最早放上去的） */
const ITEMS: readonly { t: string; kind: "user" | "ai" | "file" | "think" }[] = [
  { t: "你之前说的话", kind: "user" },
  { t: "它之前的回答", kind: "ai" },
  { t: "上传的教材 PDF", kind: "file" },
  { t: "它的思考过程", kind: "think" },
  { t: "这次递过来的一张（用户提示词）", kind: "user" },
];

const KIND_COLOR = {
  user: C.accent,
  ai: C.blue,
  file: C.green,
  think: C.warn,
} as const;

/** 09 上下文桌面：桌面有限、系统提示词压在最底下 */
export const DeskMemoryScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const tableStart = voStart + 8;
  const sysStart = voStart + Math.round(2.4 * fps);
  const pushStart = voStart + Math.round(5.4 * fps);

  // 纸张从上方落进桌面，最上面那张是"用户提示词"
  const itemTop = 250;
  const itemH = 40;
  const itemGap = 6;

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={1}
          chapters={CHAPTERS}
          label="03 · 上下文与提示词层级"
          title="一张办公桌，两份文件"
          accent="一张办公桌"
        />

        {/* 办公桌（俯视） */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 620,
            height: 336,
            borderRadius: 16,
            backgroundColor: "#2A2520",
            border: `1px solid #3B342C`,
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.45), 0 20px 40px rgba(0,0,0,0.35)",
            overflow: "hidden",
            ...rise(frame, tableStart, 20, 18),
          }}
        >
          {/* 桌面木纹 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 9px)",
              opacity: 0.5,
            }}
          />

          {/* 压在桌底下的系统提示词 */}
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 16,
              height: 44,
              borderRadius: 8,
              backgroundColor: "#171A20",
              border: `1px dashed ${C.blue}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              fontFamily: F.sans,
              opacity: clamp((frame - sysStart) / 12, 0, 1),
              translate: `0px ${(1 - clamp((frame - sysStart) / 14, 0, 1)) * 18}px`,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 10,
                color: C.blue,
                letterSpacing: 1.5,
              }}
            >
              SYSTEM
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.fg }}>
              系统提示词 · 压在桌面最底下
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>始终生效的规矩</span>
          </div>

          {/* 一张张纸落进来 */}
          {ITEMS.map((it, i) => {
            const st = pushStart + i * Math.round(0.9 * fps);
            const p = clamp((frame - st) / 12, 0, 1);
            const top = itemTop + i * (itemH + itemGap) - (1 - p) * 26;
            // 超过 4 张时最早那张被"挤掉"
            const pushed = i === 0 ? clamp((frame - (pushStart + 4 * Math.round(0.9 * fps))) / 12, 0, 1) : 0;
            return (
              <div
                key={it.t}
                style={{
                  position: "absolute",
                  left: 22 + pushed * 400,
                  right: 22,
                  top,
                  height: itemH,
                  borderRadius: 6,
                  backgroundColor: "#F1EDE6",
                  color: "#232023",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 12px",
                  fontFamily: F.sans,
                  fontSize: 13.5,
                  fontWeight: 600,
                  opacity: p * (1 - pushed),
                  boxShadow: "0 4px 10px rgba(0,0,0,0.28)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: KIND_COLOR[it.kind],
                  }}
                />
                {it.t}
                {i === ITEMS.length - 1 ? (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: F.mono,
                      fontSize: 10,
                      color: C.accent,
                      fontWeight: 700,
                    }}
                  >
                    USER
                  </span>
                ) : null}
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: 22,
              top: 14,
              fontFamily: F.mono,
              fontSize: 10,
              letterSpacing: 2,
              color: "#8C7F6C",
            }}
          >
            CONTEXT WINDOW · 桌面就这么大
          </div>
        </div>

        {/* 右：三份文件的定义 */}
        <div
          style={{
            position: "absolute",
            left: 716,
            top: 206,
            width: 500,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[
            {
              k: "上下文",
              t: "这一次桌面摊开的全部文字（容量有限）",
              c: C.warn,
            },
            { k: "系统提示词", t: "压在桌底、始终生效的规矩", c: C.blue },
            { k: "用户提示词", t: "这次递过来的那一张", c: C.accent },
          ].map((r, i) => (
            <Card
              key={r.k}
              style={{
                height: 86,
                padding: "14px 16px",
                borderLeft: `3px solid ${r.c}`,
                ...rise(frame, sysStart + i * 10, 14, 14),
              }}
            >
              <div style={{ fontFamily: F.sans, fontSize: 17, fontWeight: 900, color: C.fg }}>
                {r.k}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: C.muted, marginTop: 6 }}>
                {r.t}
              </div>
            </Card>
          ))}
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};