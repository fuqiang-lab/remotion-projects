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

const STEPS = [
  {
    no: "1",
    t: "发现",
    d: "启动时只加载 name + description",
    tip: "保留基本识别信息",
    color: C.blue,
  },
  {
    no: "2",
    t: "激活",
    d: "任务匹配描述时，才读完整的 SKILL.md",
    tip: "指令全文这时才进上下文",
    color: C.warn,
  },
  {
    no: "3",
    t: "执行",
    d: "按指令执行，按需加载参考文件或运行脚本",
    tip: "模板 / 脚本用时才取",
    color: C.green,
  },
];

/** 16 Skills：提示词 vs SOP + 三步渐进加载 */
export const SkillsScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const compareStart = voStart + 8;
  const stepStart = (i: number) => voStart + Math.round((3.2 + i * 1.7) * fps);
  const note = voStart + Math.round(8.6 * fps);

  // 上下文占用条：发现阶段很少，激活后涨，执行再涨
  const load = (() => {
    const s2 = stepStart(1);
    const s3 = stepStart(2);
    if (frame < s2) return 0.12;
    if (frame < s3) return 0.12 + 0.5 * clamp((frame - s2) / 12, 0, 1);
    return 0.62 + 0.3 * clamp((frame - s3) / 12, 0, 1);
  })();

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={5}
          chapters={CHAPTERS}
          label="08 · Skills"
          title="Skill 不是提示词，是可复用的工作程序"
          accent="可复用的工作程序"
        />

        {/* 上：对照 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 1152,
            display: "flex",
            gap: 16,
          }}
        >
          <Card
            style={{
              width: 300,
              height: 96,
              padding: "14px 16px",
              ...rise(frame, compareStart, 12, 12),
            }}
          >
            <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 2 }}>
              提示词
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 14.5, color: C.fg2, marginTop: 8 }}>
              这一次说完就没了
            </div>
          </Card>
          <div style={{ alignSelf: "center", fontFamily: F.sans, fontSize: 20, color: C.muted }}>→</div>
          <Card
            style={{
              width: 300,
              height: 96,
              padding: "14px 16px",
              borderColor: C.green,
              backgroundColor: C.greenSoft,
              ...rise(frame, compareStart + 8, 12, 12),
            }}
          >
            <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 800, color: C.green, letterSpacing: 2 }}>
              SKILL
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 14.5, color: C.fg, marginTop: 8 }}>
              存起来，每次照着做
            </div>
          </Card>
          <div
            style={{
              alignSelf: "center",
              marginLeft: 12,
              fontFamily: F.sans,
              fontSize: 13,
              lineHeight: 1.6,
              color: C.muted,
              width: 500,
              ...rise(frame, compareStart + 14, 10, 12),
            }}
          >
            Skill ＝ 打包好的标准流程：指令与步骤、要用的工具、模板或参考文件。
            <br />
            类比：LLM 是聪明的学生，Skill 是标准作业指导书（SOP）。
          </div>
        </div>

        {/* 下：三步渐进 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 330,
            width: 1152,
            display: "flex",
            alignItems: "stretch",
            gap: 8,
          }}
        >
          {STEPS.map((s, i) => {
            const st = stepStart(i);
            const on = frame >= st;
            return (
              <div key={s.no} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Card
                  style={{
                    width: 352,
                    height: 128,
                    padding: "14px 16px",
                    borderColor: on ? s.color : C.line,
                    backgroundColor: on ? "rgba(255,255,255,0.04)" : C.card,
                    opacity: clamp((frame - st) / 10, 0, 1) || 0.6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 999,
                        display: "grid",
                        placeItems: "center",
                        backgroundColor: on ? s.color : C.line2,
                        color: "#151318",
                        fontFamily: F.sans,
                        fontSize: 14,
                        fontWeight: 900,
                      }}
                    >
                      {s.no}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 900, color: C.fg }}>
                      {s.t}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: F.sans,
                      fontSize: 13,
                      color: C.fg2,
                      lineHeight: 1.55,
                    }}
                  >
                    {s.d}
                  </div>
                  <div style={{ marginTop: 8, fontFamily: F.sans, fontSize: 11.5, color: C.muted }}>
                    {s.tip}
                  </div>
                </Card>
                {i < STEPS.length - 1 ? (
                  <span style={{ color: C.muted, fontSize: 18, fontFamily: F.sans }}>→</span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* 上下文占用条 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 492,
            width: 1152,
            fontFamily: F.sans,
            ...rise(frame, stepStart(0), 10, 12),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11.5,
              letterSpacing: 1.5,
              color: C.muted,
              marginBottom: 8,
            }}
          >
            <span>上下文占用</span>
            <span>发现时几乎为零 —— 这就是渐进式加载的意义</span>
          </div>
          <div
            style={{
              height: 12,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.05)",
              overflow: "hidden",
              border: `1px solid ${C.line}`,
            }}
          >
            <div
              style={{
                width: `${load * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${C.blue}, ${C.warn}, ${C.green})`,
              }}
            />
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
            ...rise(frame, note, 10, 12),
          }}
        >
          SOP 不限制聪明人，它让
          <span style={{ color: C.accent, fontWeight: 800 }}>稳定质量可复制</span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};