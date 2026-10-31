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

/** 13 人格文件：一句话从"夸它"改写成"立规矩" */
export const SoulScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const badStart = voStart + 10;
  const strike = voStart + Math.round(2.2 * fps);
  const goodStart = voStart + Math.round(3.2 * fps);
  const ruleStart = voStart + Math.round(6.8 * fps);

  const bad = [
    "“你什么都懂，任何问题都直接给答案”",
    "“越详细越好，不用管对不对”",
  ];
  const good = [
    "“不编造课标条文、不虚构数据”",
    "“找不到依据就说‘未找到’”",
  ];

  // 划掉第一句的横线
  const strikeW = clamp((frame - strike) / 12, 0, 1) * 474;

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={3}
          chapters={CHAPTERS}
          label="05 · AI 的人格"
          title="人格文件不是夸 AI，是给 AI 立规矩"
          accent="给 AI 立规矩"
        />

        {/* 上：两份文件的对照 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 210,
            width: 1152,
            display: "flex",
            gap: 16,
          }}
        >
          {/* soul.md */}
          <Card
            style={{
              width: 568,
              height: 178,
              padding: "16px 18px",
              ...rise(frame, badStart - 10, 14, 14),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: C.warn }}>soul.md</span>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>
                性格设定书 · 语气、风格、价值侧重
              </span>
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: F.sans,
                fontSize: 13.5,
                lineHeight: 1.7,
                color: C.fg2,
              }}
            >
              例：“你重视实验安全和探究式教学，优先用生活现象引入。”
            </div>
          </Card>
          {/* AGENTS.md */}
          <Card
            style={{
              width: 568,
              height: 178,
              padding: "16px 18px",
              ...rise(frame, badStart - 2, 14, 14),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: C.blue }}>AGENTS.md</span>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>
                工作手册 / 岗位规程 · 流程与硬规则
              </span>
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: F.sans,
                fontSize: 13.5,
                lineHeight: 1.7,
                color: C.fg2,
              }}
            >
              “每次任务先确认年级和教材版本；输出必须含教案 + 练习 + 评价要点；安全内容须标注规范出处。”
            </div>
          </Card>
        </div>

        {/* 下：改写对照 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 406,
            width: 1152,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* 错误写法 */}
          <div style={{ width: 520, ...rise(frame, strike - 14, 12, 12) }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                fontFamily: F.sans,
                fontSize: 12,
                fontWeight: 800,
                color: C.red,
              }}
            >
              <Mark ok={false} size={16} /> 问题在哪？
            </div>
            {bad.map((b, i) => (
              <div
                key={b}
                style={{
                  position: "relative",
                  fontFamily: F.sans,
                  fontSize: 14,
                  color: C.muted,
                  padding: "6px 0",
                  opacity: frame >= badStart + i * 8 ? 1 : 0,
                }}
              >
                {b}
                {i === 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "52%",
                      width: strikeW,
                      height: 2,
                      backgroundColor: C.red,
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 22, color: C.muted }}>→</div>

          {/* 正确写法 */}
          <Card
            style={{
              width: 578,
              padding: "14px 18px",
              borderColor: C.green,
              backgroundColor: "#1E2723",
              ...rise(frame, goodStart, 14, 14),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                fontFamily: F.sans,
                fontSize: 12,
                fontWeight: 800,
                color: C.green,
              }}
            >
              <Mark size={16} /> 要这样写
            </div>
            {good.map((g, i) => (
              <div
                key={g}
                style={{
                  fontFamily: F.sans,
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.fg,
                  padding: "5px 0",
                  opacity: clamp((frame - goodStart - i * 10) / 10, 0, 1),
                }}
              >
                {g}
              </div>
            ))}
          </Card>
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 528,
            textAlign: "center",
            fontFamily: F.sans,
            fontSize: 20,
            fontWeight: 900,
            color: C.fg,
            ...rise(frame, ruleStart, 12, 14),
          }}
        >
          “不许做什么” <span style={{ color: C.accent }}>比</span> “你很棒”
          <span style={{ color: C.accent }}>更重要</span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};