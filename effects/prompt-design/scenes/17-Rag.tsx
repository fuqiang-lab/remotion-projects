import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Desk,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

/** 17 RAG：闭卷 vs 开卷五步（R-A-G 三字在口播里点出来） */
export const RagScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const queryStart = voStart + 8;
  const chunkStart = voStart + Math.round(2.0 * fps);
  const hitStart = voStart + Math.round(4.4 * fps);
  const genStart = voStart + Math.round(6.2 * fps);
  const citeStart = voStart + Math.round(7.8 * fps);

  const cards = [
    "课标原文 · 第 3 章",
    "教材目录 · 单元 2",
    "本校实训规范 · 4.1",
    "典型错例集 · 案例 7",
    "公开课逐字稿",
    "旧版教材（已作废）",
  ];
  // 命中的是第 0、2 两张
  const hits = [0, 2];

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={5}
          chapters={CHAPTERS}
          label="09 · 知识库与 RAG"
          title="RAG 把“闭卷考试”变成“开卷考试”"
          accent="“开卷考试”"
        />

        {/* 左：提问 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 300,
            ...rise(frame, queryStart, 12, 14),
          }}
        >
          <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.accent }}>
            提问
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "12px 14px",
              borderRadius: "10px 10px 10px 2px",
              backgroundColor: C.accentSoft,
              border: `1px solid ${C.accentLine}`,
              fontFamily: F.sans,
              fontSize: 14,
              lineHeight: 1.6,
              color: C.fg,
            }}
          >
            “这一节实训课，安全操作要求的依据是哪一条？”
          </div>

          {/* 闭卷时的样子 */}
          <div
            style={{
              marginTop: 70,
              padding: "12px 14px",
              borderRadius: 10,
              border: `1px dashed ${C.red}`,
              backgroundColor: C.redSoft,
              fontFamily: F.sans,
              fontSize: 12.5,
              lineHeight: 1.6,
              color: C.fg2,
              ...rise(frame, queryStart + 20, 10, 12),
            }}
          >
            闭卷时：凭记忆瞎编，还给不出出处
          </div>
        </div>

        {/* 中：知识库（检索） */}
        <div
          style={{
            position: "absolute",
            left: 400,
            top: 206,
            width: 300,
          }}
        >
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              color: C.blue,
              ...rise(frame, chunkStart - 6, 10, 12),
            }}
          >
            知识库 · 切块 + 建索引
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {cards.map((c, i) => {
              const on = frame >= chunkStart + i * 5;
              const hit = hits.includes(i) && frame >= hitStart + (hits.indexOf(i) + 1) * 8;
              return (
                <div
                  key={c}
                  style={{
                    height: 38,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 12px",
                    fontFamily: F.sans,
                    fontSize: 12.5,
                    color: hit ? C.fg : C.fg2,
                    backgroundColor: hit ? C.blueSoft : C.card,
                    border: `1px ${hit ? "solid" : "dashed"} ${hit ? C.blue : C.line}`,
                    opacity: on ? 1 : 0.55,
                    translate: hit ? "10px 0" : "0px 0",
                    boxShadow: hit ? `0 0 0 3px rgba(108,140,240,0.10)` : "none",
                  }}
                >
                  <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted }}>
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  {c}
                  {hit ? (
                    <span style={{ marginLeft: "auto", color: C.blue, fontWeight: 800 }}>✓ 相关</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右：生成答案 */}
        <div
          style={{
            position: "absolute",
            left: 740,
            top: 206,
            width: 476,
            ...rise(frame, genStart - 8, 14, 14),
          }}
        >
          <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.green }}>
            让模型照着这几段作答
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "14px 16px",
              borderRadius: "10px 10px 2px 10px",
              backgroundColor: C.card,
              border: `1px solid ${C.green}`,
              fontFamily: F.sans,
              fontSize: 13.5,
              lineHeight: 1.75,
              color: C.fg2,
            }}
          >
            实训前须完成安全检查，包括设备状态、防护装置与个人防护用品。
            <span
              style={{
                display: "inline-block",
                marginLeft: 4,
                padding: "1px 6px",
                borderRadius: 4,
                fontFamily: F.mono,
                fontSize: 11,
                color: C.blue,
                backgroundColor: C.blueSoft,
                opacity: clamp((frame - citeStart) / 8, 0, 1),
              }}
            >
              [#03]
            </span>
            <br />
            每学期开学须进行一次应急演练。
            <span
              style={{
                display: "inline-block",
                marginLeft: 4,
                padding: "1px 6px",
                borderRadius: 4,
                fontFamily: F.mono,
                fontSize: 11,
                color: C.blue,
                backgroundColor: C.blueSoft,
                opacity: clamp((frame - citeStart - 6) / 8, 0, 1),
              }}
            >
              [#01]
            </span>
          </div>

          <div
            style={{
              marginTop: 14,
              fontFamily: F.sans,
              fontSize: 12.5,
              color: C.muted,
              lineHeight: 1.7,
              ...rise(frame, citeStart + 12, 10, 12),
            }}
          >
            R · Retrieve  检索最相关的几段
            <br />
            A · Augmented  连同问题一起交给模型
            <br />
            G · Generation  照着资料作答，并标注出处
          </div>
        </div>

        {/* 五步刻度 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 520,
            display: "flex",
            alignItems: "center",
            gap: 0,
            ...rise(frame, chunkStart, 10, 12),
          }}
        >
          {["提问", "切块", "建索引", "检索", "生成"].map((s, i) => {
            const on = frame >= [queryStart, chunkStart, chunkStart + 20, hitStart, genStart][i];
            return (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: on ? C.fg : C.muted,
                    padding: "5px 12px",
                    borderRadius: 999,
                    border: `1px solid ${on ? (i >= 3 ? C.green : C.line2) : C.line}`,
                    backgroundColor: on && i >= 3 ? C.greenSoft : "transparent",
                  }}
                >
                  {i + 1} {s}
                </span>
                {i < 4 ? (
                  <div style={{ width: 54, height: 1, backgroundColor: C.line2, margin: "0 6px" }} />
                ) : null}
              </div>
            );
          })}
          <span style={{ marginLeft: "auto", fontFamily: F.sans, fontSize: 12, color: C.muted }}>
            第 4、5 步是关键：先查、后答、答必给依据
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};