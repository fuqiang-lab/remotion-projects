import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CaptionPill,
  Card,
  Desk,
  Mark,
  SceneFrame,
  Stage,
  rise,
} from "../../../styles/dark-desk";
import { C, F, clamp } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

/** 08 分步定格式：一次说完 vs 先框架我确认再填充 */
export const StepwiseScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  // 左：一次性生成一整块（越长越完）
  const leftStart = voStart + 10;
  // 右：三步走，第二步开始前有"我确认"
  const stepStart = voStart + Math.round(3.6 * fps);
  const stepGap = Math.round(1.4 * fps);
  const formatStart = voStart + Math.round(8.2 * fps);

  const blocks = [
    "中职电子商务专业《直播开场话术》教学设计",
    "（一）教学目标……（二）学情分析……",
    "（三）教学过程……（四）板书设计……",
    "（五）作业布置……（六）教学反思……",
    "……再来一个课后拓展（没让你写）",
  ];

  const steps = [
    { t: "第 1 步", d: "只做环节框架", tag: "我确认" },
    { t: "第 2 步", d: "确认后再填活动", tag: "我确认" },
    { t: "第 3 步", d: "按表格输出", tag: "定格式" },
  ];

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={0}
          chapters={CHAPTERS}
          label="02 · 提示词"
          title="两条容易被忽略的进阶原则"
          accent="进阶原则"
        />

        {/* 左：一次说完 */}
        <Card
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 548,
            height: 300,
            padding: "16px 18px",
            overflow: "hidden",
            ...rise(frame, leftStart, 16, 16),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mark ok={false} />
            <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 800, color: C.red }}>
              误区：一次说完，越长越好
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: F.mono,
              fontSize: 12.5,
              color: C.fg2,
              padding: "7px 10px",
              borderRadius: 6,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            “帮我写好完整教案。”
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {blocks.map((b, i) => {
              const st = leftStart + 8 + i * 9;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: F.sans,
                    fontSize: 12.5,
                    color: C.fg2,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    opacity: clamp((frame - st) / 6, 0, 1),
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: 4,
                    padding: "0 8px",
                  }}
                >
                  {b}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: F.sans,
              fontSize: 12.5,
              color: C.red,
              ...rise(frame, leftStart + 60, 8, 12),
            }}
          >
            环节不对时，前面已经全部生成完 —— 你只能在最后挑毛病
          </div>
        </Card>

        {/* 右：分步 + 定格式 */}
        <Card
          style={{
            position: "absolute",
            left: 628,
            top: 206,
            width: 588,
            height: 300,
            padding: "16px 18px",
            borderColor: C.green,
            ...rise(frame, stepStart - 14, 16, 16),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mark />
            <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 800, color: C.green }}>
              做法：分步 + 定格式
            </span>
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4 }}>
            {steps.map((s, i) => {
              const st = stepStart + i * stepGap;
              const on = frame >= st;
              return (
                <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 158,
                      height: 92,
                      borderRadius: 10,
                      padding: "12px 12px",
                      backgroundColor: on ? C.greenSoft : "rgba(255,255,255,0.03)",
                      border: `1px solid ${on ? C.green : C.line}`,
                      opacity: on ? 1 : 0.4,
                    }}
                  >
                    <div style={{ fontFamily: F.mono, fontSize: 10, color: on ? C.green : C.muted }}>
                      {s.t}
                    </div>
                    <div
                      style={{
                        fontFamily: F.sans,
                        fontSize: 13.5,
                        fontWeight: 800,
                        color: C.fg,
                        marginTop: 6,
                        lineHeight: 1.4,
                      }}
                    >
                      {s.d}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: F.sans,
                        fontSize: 11,
                        color: C.muted,
                      }}
                    >
                      ← {s.tag}
                    </div>
                  </div>
                  {i < steps.length - 1 ? (
                    <span
                      style={{
                        color: on ? C.green : C.muted,
                        fontFamily: F.sans,
                        fontSize: 16,
                        margin: "0 2px",
                      }}
                    >
                      →
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 8,
              ...rise(frame, stepStart + stepGap, 8, 12),
            }}
          >
            {["“输出用表格”", "“每点不超过两句”"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: F.sans,
                  fontSize: 12.5,
                  color: C.fg2,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px dashed ${C.line2}`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Card>

        {/* 底部结论 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 534,
            textAlign: "center",
            fontFamily: F.sans,
            fontSize: 20,
            fontWeight: 900,
            color: C.fg,
            ...rise(frame, formatStart, 12, 14),
          }}
        >
          格式约束 <span style={{ color: C.accent }}>=</span> 质量约束
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};