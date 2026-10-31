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
import { C, F, clamp, pop } from "../../../styles/dark-desk";
import type { SceneProps } from "../scenes-meta";
import { CHAPTERS } from "../scenes-meta";

const RISKS = [
  {
    k: "幻觉",
    d: "会在没有依据时给出确定表述",
    fix: "给材料 · 允许说“不知道” · 人工核验",
    color: C.warn,
  },
  {
    k: "隐私",
    d: "学生姓名、学号、成绩、家庭情况",
    fix: "先脱敏 · 用合规平台 · 敏感数据不出校",
    color: C.red,
  },
  {
    k: "注入",
    d: "网页或文档里的隐藏指令可能改变行为",
    fix: "不轻信读到的内容 · 异常即停",
    color: C.blue,
  },
];

/** 19 一条底线：三条风险 + 人机分工 */
export const BottomLineScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const riskStart = (i: number) => voStart + Math.round((0.8 + i * 1.3) * fps);
  const splitStart = voStart + Math.round(5.2 * fps);

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={6}
          chapters={CHAPTERS}
          label="10 · 用好 Agent"
          title="三条底线：敢用，不滥用"
          accent="敢用，不滥用"
        />

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: 652,
          }}
        >
          {RISKS.map((r, i) => {
            const st = riskStart(i);
            const on = frame >= st;
            return (
              <Card
                key={r.k}
                style={{
                  height: 82,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderLeft: `3px solid ${on ? r.color : C.line}`,
                  opacity: clamp((frame - st) / 10, 0, 1) || 0.65,
                  translate: `${(1 - clamp((frame - st) / 12, 0, 1)) * 14}px 0`,
                }}
              >
                <div style={{ width: 78 }}>
                  <div style={{ fontFamily: F.sans, fontSize: 17, fontWeight: 900, color: r.color }}>
                    {r.k}
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.muted, marginTop: 3 }}>
                    RISK {i + 1}
                  </div>
                </div>
                <div style={{ fontFamily: F.sans, flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{r.d}</div>
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.fg,
                    }}
                  >
                    <Mark size={14} color={on ? C.green : C.line2} />
                    {r.fix}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 右：人机分工 */}
        <div
          style={{
            position: "absolute",
            left: 748,
            top: 206,
            width: 468,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              color: C.muted,
              ...rise(frame, splitStart - 12, 10, 12),
            }}
          >
            判断清单 · 什么时候不该用 AI
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Card
              style={{
                flex: 1,
                height: 196,
                padding: "14px 14px",
                borderColor: C.accentLine,
                ...pop(frame, fps, splitStart, 15, 0.7),
              }}
            >
              <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 900, color: C.accent }}>
                它干重复的活
              </div>
              {["格式转换、摘要、排版", "从零起草文本", "资料转成另一种形态", "在真资料里检索答案"].map(
                (t, i) => (
                  <div
                    key={t}
                    style={{
                      marginTop: 8,
                      fontFamily: F.sans,
                      fontSize: 12,
                      color: C.fg2,
                      opacity: clamp((frame - splitStart - 6 - i * 5) / 8, 0, 1),
                    }}
                  >
                    · {t}
                  </div>
                ),
              )}
            </Card>
            <Card
              style={{
                flex: 1,
                height: 196,
                padding: "14px 14px",
                borderColor: C.redSoft,
                ...pop(frame, fps, splitStart + 8, 15, 0.7),
              }}
            >
              <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 900, color: C.red }}>
                你干要紧的判断
              </div>
              {["成绩、评语、处分结论", "未脱敏的学生信息", "需要个人判断的教学取舍", "没读过的材料让它“总结”"].map(
                (t, i) => (
                  <div
                    key={t}
                    style={{
                      marginTop: 8,
                      fontFamily: F.sans,
                      fontSize: 12,
                      color: C.fg2,
                      opacity: clamp((frame - splitStart - 14 - i * 5) / 8, 0, 1),
                    }}
                  >
                    · {t}
                  </div>
                ),
              )}
            </Card>
          </div>
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 12,
              color: C.muted,
              lineHeight: 1.6,
              ...rise(frame, splitStart + 26, 8, 12),
            }}
          >
            判断标准只有一条：结果能否被复核、责任能否被明确。
          </div>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};