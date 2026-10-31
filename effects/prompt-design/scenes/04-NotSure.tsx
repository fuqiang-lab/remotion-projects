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

/** 幻觉样本：越具体越容易被编出来 */
const FAKE = [
  "依据《中等职业学校实习管理规定》第四十二条，顶岗实习时间不得超过 6 个月。",
  "2024 年 3 月，教育部办公厅印发〔2024〕12 号文件，明确实训课时占比不低于 45%。",
];

/** 04 像我但不对：像 = 合格，对 = 要核实 */
export const HallucinationScene: React.FC<SceneProps> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voStart = Math.round(0.6 * fps);

  const fakeStart = voStart + 14;
  const warnStart = voStart + Math.round(3.4 * fps);
  const realStart = voStart + Math.round(5.0 * fps);
  const badgeLike = pop(frame, fps, voStart + Math.round(0.9 * fps), 13, 0.55);
  const badgeTrue = pop(frame, fps, realStart + 6, 13, 0.55);
  const scan = clamp((frame - warnStart) / 26, 0, 1);

  return (
    <SceneFrame>
      <Desk>
        <Stage
          chapter={0}
          chapters={CHAPTERS}
          label="01 · 什么是 LLM"
          title="后果一：它很会“像那么回事”"
          accent="“像那么回事”"
        />

        {/* 左：像 —— 格式工整的"假答案" */}
        <Card
          style={{
            position: "absolute",
            left: 64,
            top: 206,
            width: 560,
            height: 276,
            padding: "18px 20px",
            overflow: "hidden",
            ...rise(frame, 10, 18, 16),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mark warn />
            <span style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 800, color: C.warn }}>
              AI 输出
            </span>
            <span style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 10, color: C.muted }}>
              tone: professional
            </span>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {FAKE.map((t, i) => (
              <div
                key={i}
                style={{
                  fontFamily: F.sans,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: C.fg2,
                  ...rise(frame, fakeStart + i * 10, 10, 14),
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* 扫描线：像 → 对 的核查 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              height: "100%",
              opacity: scan > 0 && scan < 1 ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${scan * 100}%`,
                height: 2,
                backgroundColor: C.warn,
                boxShadow: `0 0 18px ${C.warn}`,
              }}
            />
          </div>
        </Card>

        {/* 右：对 —— 需要核实的清单 */}
        <Card
          style={{
            position: "absolute",
            left: 656,
            top: 206,
            width: 560,
            height: 276,
            padding: "18px 20px",
            ...rise(frame, realStart - 8, 18, 16),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mark />
            <span style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 800, color: C.green }}>
              你自己核实
            </span>
          </div>
          {[
            { k: "文号", v: "〔2024〕12 号 —— 查原件" },
            { k: "数字", v: "6 个月、45% —— 查标准" },
            { k: "出处", v: "第 42 条 —— 查条文位置" },
          ].map((row, i) => (
            <div
              key={row.k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 46,
                borderBottom: i < 2 ? `1px dashed ${C.line}` : "none",
                ...rise(frame, realStart + 4 + i * 8, 10, 12),
              }}
            >
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.fg,
                  width: 44,
                }}
              >
                {row.k}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: 12.5, color: C.fg2 }}>{row.v}</span>
            </div>
          ))}
          <div
            style={{
              marginTop: 12,
              fontFamily: F.sans,
              fontSize: 13.5,
              color: C.muted,
              ...rise(frame, realStart + 34, 8, 12),
            }}
          >
            汽修、护理这类流程复杂、专业性强的场景，尤其要警惕。
          </div>
        </Card>

        {/* 两个结论徽章 */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 486 - 30,
            width: 560,
            display: "flex",
            justifyContent: "center",
            ...badgeLike,
          }}
        >
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 15,
              fontWeight: 800,
              color: "#2A1D08",
              backgroundColor: C.warn,
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            像 = 它的强项
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 656,
            top: 486 - 30,
            width: 560,
            display: "flex",
            justifyContent: "center",
            ...badgeTrue,
          }}
        >
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 15,
              fontWeight: 800,
              color: "#0E1A14",
              backgroundColor: C.green,
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            对 = 你的责任
          </span>
        </div>

        <CaptionPill text={line.text} start={voStart} />
      </Desk>
    </SceneFrame>
  );
};