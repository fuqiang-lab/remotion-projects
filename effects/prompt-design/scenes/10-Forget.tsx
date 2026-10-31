import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Card,
  ChalkLine,
  Desk,
  Mark,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

/** 10 写了就忘：三条现象 + 对策，配两笔手绘斜线 */
export const ForgetScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const rowsStart = voStart + 10;
  const fixStart = voStart + Math.round(6.0 * fps);
  const slash = voStart + Math.round(8.4 * fps);

  const rows = [
    {
      t: "长对话失忆",
      d: "聊到第 40 轮，开头说的教材版本早被挤下去了",
    },
    {
      t: "系统提示词没立住",
      d: "每轮临时交代，交代一乱，它就飘",
    },
    {
      t: "上下文塞太满",
      d: "20 个 PDF 一起丢进去，要用的那份反而被埋了",
    },
  ];

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={1}
          chapters={CHAPTERS}
          label="03 · 上下文与提示词层级"
          title="为什么 AI 用着用着就“忘事”“跑偏”"
          accent="“忘事”“跑偏”"
        />

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 660,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {rows.map((r, i) => {
            const st = rowsStart + i * Math.round(1.4 * fps);
            return (
              <Card
                key={r.t}
                style={{
                  height: 84,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  ...rise(frame, st, 16, 14),
                }}
              >
                <Mark ok={false} />
                <div style={{ fontFamily: F.sans }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: C.fg }}>{r.t}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 5 }}>{r.d}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 右：对策 */}
        <Card
          style={{
            position: "absolute",
            left: 756,
            top: 206,
            width: 460,
            height: 288,
            padding: "18px 20px",
            borderColor: C.green,
            backgroundColor: "#1E2723",
            ...rise(frame, fixStart, 18, 16),
          }}
        >
          <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.green }}>
            SO · 两条纪律
          </div>
          <div style={{ marginTop: 14, fontFamily: F.sans }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontFamily: F.mono, fontSize: 14, color: C.green, width: 18 }}>1</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: C.fg }}>交代清楚</div>
                <div style={{ fontSize: 13, color: C.fg2, marginTop: 6, lineHeight: 1.6 }}>
                  重要信息在关键节点再说一遍；一个任务，一个新对话
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <span style={{ fontFamily: F.mono, fontSize: 14, color: C.green, width: 18 }}>2</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: C.fg }}>越相关越好</div>
                <div style={{ fontSize: 13, color: C.fg2, marginTop: 6, lineHeight: 1.6 }}>
                  不是越多越好——一股脑塞，桌子堆满，真正要用的那份被埋了
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 两笔手绘斜线：划掉"越多越好"的直觉 */}
        <ChalkLine x={[740, 1232]} y={[462, 446]} start={slash} thickness={5} />
        <ChalkLine x={[740, 632]} y={[500, 488]} start={slash + 4} thickness={5} />

        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 526,
            display: "flex",
            justifyContent: "center",
            fontFamily: F.sans,
            fontSize: 21,
            fontWeight: 900,
            color: C.fg,
            ...rise(frame, slash + 12, 12, 14),
          }}
        >
          上下文不是越多越好，是<span style={{ color: C.accent, margin: "0 6px" }}>越相关越好</span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};