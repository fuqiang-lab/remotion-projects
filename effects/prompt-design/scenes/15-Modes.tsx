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

const MODES = [
  {
    k: "问答",
    en: "Q & A",
    d: "它只出主意，工具只读不改",
    like: "咨询顾问：给建议，不动手",
    check: "判断权 100% 在你",
    color: C.blue,
    soft: C.blueSoft,
    x: 0,
  },
  {
    k: "Plan",
    en: "PLAN MODE",
    d: "它先写计划，你点头再执行",
    like: "建筑师：先出图纸，再施工",
    check: "检查点：你审计划",
    color: C.warn,
    soft: C.warnSoft,
    x: 0.5,
  },
  {
    k: "Goal",
    en: "GOAL MODE",
    d: "你只给终点，它自己跑到完成",
    like: "自动驾驶：设定目的地",
    check: "检查点：你验结果",
    color: C.accent,
    soft: C.accentSoft,
    x: 1,
  },
];

/** 15 三种模式：三档卡片 + 一根自主权滑杆 */
export const ModesScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const cardStart = (i: number) => voStart + Math.round((1.0 + i * 1.45) * fps);
  const sliderStart = voStart + Math.round(5.4 * fps);

  // 滑杆上的点从最左滑到最右
  const knob = clamp((frame - sliderStart) / 26, 0, 1);
  const sliderW = 1040;

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={4}
          chapters={CHAPTERS}
          label="07 · 三种运行模式"
          title="三档模式：你愿意放多少权"
          accent="放多少权"
        />

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            display: "flex",
            gap: 16,
          }}
        >
          {MODES.map((m, i) => {
            const st = cardStart(i);
            const s = pop(frame, fps, st, 15, 0.7);
            return (
              <Card
                key={m.k}
                style={{
                  width: 373,
                  height: 250,
                  padding: "18px 20px",
                  borderColor: frame >= st ? m.color : C.line,
                  backgroundColor: frame >= st ? m.soft : C.card,
                  ...s,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 26, fontWeight: 900, color: C.fg }}>
                    {m.k}
                  </span>
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: 10,
                      letterSpacing: 1.5,
                      color: m.color,
                    }}
                  >
                    {m.en}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontFamily: F.sans,
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.fg,
                    lineHeight: 1.55,
                  }}
                >
                  {m.d}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: F.sans,
                    fontSize: 13,
                    color: C.fg2,
                    paddingTop: 12,
                    borderTop: `1px dashed ${C.line2}`,
                  }}
                >
                  {m.like}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    fontFamily: F.sans,
                    fontSize: 12,
                    fontWeight: 800,
                    color: m.color,
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${m.color}`,
                  }}
                >
                  {m.check}
                </div>
              </Card>
            );
          })}
        </div>

        {/* 自主权滑杆 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 470,
            fontFamily: F.sans,
            ...rise(frame, sliderStart - 10, 12, 14),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11.5,
              letterSpacing: 2,
              color: C.muted,
              marginBottom: 14,
            }}
          >
            <span>你的控制权 · 自主权小</span>
            <span>它自主决定的范围 · 自主权大</span>
          </div>
          <div style={{ position: "relative", height: 6, marginLeft: 56, marginRight: 56 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                backgroundColor: C.line,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${knob * 100}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${C.blue}, ${C.warn}, ${C.accent})`,
              }}
            />
            {MODES.map((m) => {
              const x = (m.x * (sliderW - 112)) as number;
              const on = knob >= m.x - 0.02;
              return (
                <div
                  key={m.k}
                  style={{
                    position: "absolute",
                    left: x,
                    top: -9,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    backgroundColor: on ? m.color : C.bg2,
                    border: `3px solid ${C.bg}`,
                    boxShadow: on ? `0 0 14px ${m.color}` : "none",
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              marginLeft: 56,
              marginRight: 56,
              fontSize: 12,
              color: C.muted,
            }}
          >
            <span>它不动任何文件</span>
            <span>你点头它才动手</span>
            <span>越往右，验收标准越要提前写清</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 540,
            textAlign: "center",
            fontFamily: F.sans,
            fontSize: 15,
            color: C.fg2,
            opacity: clamp((frame - sliderStart - 20) / 12, 0, 1),
          }}
        >
          三档共用同一个模型，差别在 Harness 的
          <span style={{ color: C.accent, fontWeight: 800 }}>授权与确认设置</span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};