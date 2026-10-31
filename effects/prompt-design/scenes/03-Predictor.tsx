import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Card,
  ChalkCircle,
  Desk,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp, pop } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

/** 候选词与抽中的概率（按口播时长排好节奏） */
const CANDS: readonly { word: string; p: number; picked: boolean }[] = [
  { word: "疑", p: 0.82, picked: true },
  { word: "是", p: 0.71, picked: true },
  { word: "地", p: 0.54, picked: true },
  { word: "上", p: 0.66, picked: true },
  { word: "霜", p: 0.93, picked: true },
];

/** 03 下一个词预测器：输入 → 逐词续写 → 下一个词的概率候选 */
export const PredictorScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  // 口播约 8.5s：输入 0.7s → 5 个词 1.5s~4.2s → 候选面板 3.9s → 注释 5.6s
  const inputStart = voStart + 10;
  const wordStart = (i: number) => voStart + Math.round((1.5 + i * 0.68) * fps);
  const panelStart = voStart + Math.round(3.9 * fps);
  const noteStart = voStart + Math.round(4.6 * fps);

  const typed = clamp((frame - inputStart) / 10, 0, 1);
  const prompt = "床前明月光，";
  const caret = Math.floor(frame / 8) % 2 === 0;

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={0}
          chapters={CHAPTERS}
          label="01 · 什么是 LLM"
          title="一句话定义：下一个词预测器"
          accent="下一个词预测器"
        />

        {/* 左：输入框 */}
        <Card
          style={{
            position: "absolute",
            left: 64,
            top: 210,
            width: 560,
            height: 62,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 10,
            ...rise(frame, 8, 14, 14),
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              backgroundColor: C.blueSoft,
              color: C.blue,
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            你
          </span>
          <span style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 700, color: C.fg }}>
            {prompt.slice(0, Math.round(prompt.length * typed))}
          </span>
          <span
            style={{
              width: 2,
              height: 24,
              backgroundColor: C.accent,
              opacity: caret ? 1 : 0,
            }}
          />
        </Card>

        {/* 左：续写结果 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 296,
            width: 560,
            fontFamily: F.sans,
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              letterSpacing: 2,
              color: C.muted,
              marginBottom: 12,
              ...rise(frame, wordStart(0) - 6, 8, 10),
            }}
          >
            MODEL OUTPUT · 一个词一个词往下接
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {CANDS.map((c, i) => {
              const st = wordStart(i);
              const s = pop(frame, fps, st, 13, 0.55);
              return (
                <div
                  key={c.word}
                  style={{
                    width: 58,
                    height: 62,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: F.sans,
                    fontSize: 28,
                    fontWeight: 900,
                    color: C.fg,
                    backgroundColor: C.cardHi,
                    border: `1px solid ${C.accentLine}`,
                    boxShadow: `0 0 0 3px ${C.accentSoft}`,
                    ...s,
                  }}
                >
                  {c.word}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右：概率候选面板 */}
        <Card
          style={{
            position: "absolute",
            left: 672,
            top: 210,
            width: 544,
            height: 236,
            padding: "18px 20px 0",
            ...rise(frame, panelStart - 8, 18, 16),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 700, color: C.fg2 }}>
              按训练中学到的规律，猜下一个词
            </span>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted }}>P(next | 上文)</span>
          </div>
          {[
            { w: "霜", p: 0.93, on: true },
            { w: "雪", p: 0.03, on: false },
            { w: "光", p: 0.02, on: false },
            { w: "白", p: 0.01, on: false },
          ].map((row, i) => {
            const st = panelStart + i * 6;
            const grow = clamp((frame - st) / 16, 0, 1);
            return (
              <div
                key={row.w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 40,
                  opacity: clamp((frame - st) / 8, 0, 1),
                }}
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 18,
                    fontWeight: 900,
                    width: 30,
                    color: row.on ? C.accent : C.fg2,
                  }}
                >
                  {row.w}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${row.p * 100 * grow}%`,
                      height: "100%",
                      borderRadius: 999,
                      backgroundColor: row.on ? C.accent : C.line2,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 12,
                    width: 56,
                    textAlign: "right",
                    color: row.on ? C.fg : C.muted,
                  }}
                >
                  {row.p.toFixed(2)}
                </span>
              </div>
            );
          })}
        </Card>

        {/* 右下注释 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 430,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontFamily: F.sans,
            ...rise(frame, noteStart, 12, 14),
          }}
        >
          <span style={{ fontSize: 17, color: C.muted }}>不是查到的，是</span>
          <span
            style={{
              position: "relative",
              fontSize: 25,
              fontWeight: 900,
              color: C.fg,
              padding: "0 6px",
              display: "inline-block",
            }}
          >
            “接”出来的
            {frame >= noteStart + 10 ? (
              <ChalkCircle width={180} height={44} start={noteStart + 10} stroke={3} />
            ) : null}
          </span>
          <span style={{ width: 1, height: 18, backgroundColor: C.line2, margin: "0 6px" }} />
          <span style={{ fontSize: 15, color: C.fg2, lineHeight: 1.6 }}>
            高维模式匹配
            <br />
            <span style={{ color: C.muted, fontSize: 13 }}>不是数据库，也谈不上“理解”</span>
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};