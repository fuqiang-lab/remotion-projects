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

const ELEMENTS: readonly { k: string; q: string; ex: string }[] = [
  { k: "角色", q: "你是谁", ex: "“10 年中职数控实训教师”" },
  { k: "任务", q: "干什么", ex: "“45 分钟保养实训教案”" },
  { k: "对象", q: "给谁看", ex: "“高一，没做过保养”" },
  { k: "格式", q: "什么样", ex: "“表格：环节—时间—活动—评价”" },
  { k: "约束", q: "别越界", ex: "“评价可量化；安全须标出处”" },
];

/** 07 五要素：五个要素各自落位 */
export const FiveElementScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  // 口播约 12s：每 1.7s 落一个要素，最后 8.6s 出记法（切入第二行）
  const base = voStart + 12;
  const per = Math.round(1.7 * fps);
  const memoStart = voStart + Math.round(9.4 * fps);

  const W = 222;
  const H = 152;
  const GAPX = 16;
  const GAPY = 14;
  const gridLeft = 64;
  const gridTop = 214;
  const pos = (i: number) => ({
    left: gridLeft + (i % 3) * (W + GAPX),
    top: gridTop + Math.floor(i / 3) * (H + GAPY),
  });

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={0}
          chapters={CHAPTERS}
          label="02 · 提示词"
          title="五要素：把该说的都说清楚"
          accent="五要素"
        />

        {ELEMENTS.map((e, i) => {
          const st = base + i * per;
          const p = pos(i);
          const on = frame >= st;
          return (
            <Card
              key={e.k}
              style={{
                position: "absolute",
                ...p,
                width: W,
                height: H,
                padding: "16px 18px",
                borderColor: on ? C.accentLine : C.line,
                backgroundColor: on ? "#29211F" : C.card,
                opacity: clamp((frame - st) / 10, 0, 1) || 0.62,
                translate: `0px ${(1 - clamp((frame - st) / 14, 0, 1)) * 16}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 900, color: C.accent }}>
                  {e.k}
                </span>
                <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 700, color: C.fg2 }}>
                  {e.q}
                </span>
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: F.sans,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: on ? C.fg : C.muted,
                }}
              >
                {e.ex}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 14,
                  fontFamily: F.mono,
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: 1,
                }}
              >
                0{i + 1}
              </div>
            </Card>
          );
        })}

        {/* 第六格：记法 */}
        <Card
          style={{
            position: "absolute",
            ...pos(5),
            width: W,
            height: H,
            padding: "16px 18px",
            backgroundColor: C.greenSoft,
            borderColor: C.green,
            ...rise(frame, memoStart, 14, 16),
          }}
        >
          <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.green }}>
            记法 · 一句话
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: F.sans,
              fontSize: 15.5,
              lineHeight: 1.6,
              fontWeight: 800,
              color: C.fg,
            }}
          >
            你是谁、干什么、
            <br />
            给谁看、什么样、
            <br />
            别越界
          </div>
        </Card>

        {/* 右侧：拟合说明 */}
        <div
          style={{
            position: "absolute",
            left: 854,
            top: 224,
            width: 362,
            fontFamily: F.sans,
            ...rise(frame, memoStart + 10, 14, 16),
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: C.muted }}>
            为什么是这五样
          </div>
          <div style={{ marginTop: 12, fontSize: 15.5, lineHeight: 1.75, color: C.fg2 }}>
            这五样一写，
            <span style={{ color: C.fg, fontWeight: 800 }}>它就没多少可猜的了</span>。
          </div>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${C.line}`,
              fontSize: 13.5,
              lineHeight: 1.7,
              color: C.muted,
            }}
          >
            好提示词不靠背万能句式，
            <br />
            靠“把 AI 需要知道、但它不可能自己知道的信息，主动补齐”。
          </div>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};