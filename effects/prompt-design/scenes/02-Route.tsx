import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Card,
  Desk,
  SceneFrame,
  Stage,
  Tag,
  rise,
} from "../../../styles/dark-desk";
import { C, F } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

type Row = {
  no: string;
  tag: string;
  tagEn: string;
  items: string[];
  color: string;
  soft: string;
  chapter: number | null;
};

const ROWS: readonly Row[] = [
  {
    no: "01",
    tag: "地基",
    tagEn: "FOUNDATION",
    items: ["LLM 是什么", "提示词怎么派活", "上下文与两种提示词"],
    color: C.blue,
    soft: C.blueSoft,
    chapter: 0,
  },
  {
    no: "02",
    tag: "跃迁",
    tagEn: "UPGRADE",
    items: ["Agent 与 Harness", "人格与记忆", "三种运行模式"],
    color: C.accent,
    soft: C.accentSoft,
    chapter: 2,
  },
  {
    no: "03",
    tag: "落地",
    tagEn: "DELIVERY",
    items: ["Skills", "知识库与 RAG", "长任务拆解与验收"],
    color: C.green,
    soft: C.greenSoft,
    chapter: 5,
  },
];

/** 02 三项任务：三行任务卡依次落位，右侧点亮对应章节 */
export const RouteScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);
  // 口播约 10.8s：三行分别落在 1.4s / 3.9s / 7.2s
  const starts = [voStart + 18, voStart + Math.round(3.9 * fps), voStart + Math.round(7.2 * fps)];

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={null}
          chapters={CHAPTERS}
          label="导入 · 本课路线"
          title="本次课要了解的三项任务"
          accent="三项任务"
        />

        {ROWS.map((row, i) => {
          const start = starts[i];
          const s = spring({ frame: frame - start, fps, config: { damping: 17, mass: 0.7 } });
          const on = frame >= start;
          return (
            <Card
              key={row.no}
              style={{
                position: "absolute",
                left: 64,
                top: 214 + i * 92,
                width: 712,
                height: 78,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 20px",
                borderColor: on ? row.color : C.line,
                backgroundColor: on ? row.soft : C.card,
                opacity: Math.min(1, Math.max(0, (frame - start) / 8 + 0.15)),
                translate: `0px ${(1 - s) * 26}px`,
              }}
            >
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 22,
                  fontWeight: 500,
                  color: row.color,
                  width: 36,
                }}
              >
                {row.no}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, width: 92 }}>
                <span style={{ fontFamily: F.sans, fontSize: 21, fontWeight: 900, color: C.fg }}>
                  {row.tag}
                </span>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 9,
                    letterSpacing: 1.5,
                    color: C.muted,
                  }}
                >
                  {row.tagEn}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {row.items.map((it) => (
                  <Tag key={it} color={C.fg2} bg="rgba(255,255,255,0.05)">
                    {it}
                  </Tag>
                ))}
              </div>
            </Card>
          );
        })}

        {/* 右侧：路线光柱，三行各自点亮 */}
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 214,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: 316,
            ...rise(frame, 10, 14, 16),
          }}
        >
          <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: 2.5, color: C.muted }}>
            ROUTE · 从这里走到那里
          </div>
          {ROWS.map((row, i) => {
            const start = starts[i];
            const s = spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.6 } });
            const lit = frame >= start;
            return (
              <div
                key={row.no}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 78,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: lit ? row.color : C.line2,
                    boxShadow: lit ? `0 0 0 5px ${row.soft}, 0 0 18px ${row.color}` : "none",
                    scale: String(lit ? 1 + 0.35 * (1 - s) : 1),
                  }}
                />
                <div style={{ flex: 1, fontFamily: F.sans }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: lit ? C.fg : C.muted }}>
                    {i === 0 ? "会说话" : i === 1 ? "会动手" : "能交差"}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
                    {i === 0 ? "模型 + 提示词" : i === 1 ? "Agent + Harness" : "Skills + 好习惯"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};