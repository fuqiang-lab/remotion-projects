import { useCurrentFrame } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, StepNo } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

const TREE = [
  { text: "demo-skill/", indent: 0, color: C.ink, tag: null, core: false },
  { text: "├─ SKILL.md", indent: 1, color: C.accent, tag: "核心：说明与流程（必须）", core: true },
  { text: "├─ scripts/", indent: 1, color: C.ink2, tag: "脚本：读文件、调数据", core: false },
  { text: "├─ references/", indent: 1, color: C.ink2, tag: "参考：规范、案例、约束", core: false },
  { text: "└─ templates/", indent: 1, color: C.ink2, tag: "模板：报告、表格、版式", core: false },
];

const RULES = [
  { t: "SKILL.md 必须有", s: "文件名固定，大小写一致" },
  { t: "文件夹名用短横线小写", s: "如 demo-skill、lesson-plan" },
  { t: "frontmatter 里 name / description 必填", s: "描述写清楚，模型才知道要不要用它" },
];

/** 04 一个 Skill 里装了什么：目录树 + 三条规矩 */
export const AnatomyScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame>
      <Nav chapter={0} label="是什么" page={nav.page} total={nav.total} />
      <SceneTitle
        label="ANATOMY · 解剖"
        title="Skill 里装了什么"
        accent="装了什么"
      />

      <div style={{ position: "absolute", left: 64, top: 210, width: 600 }}>
        <Card style={{ padding: "20px 22px", ...rise(frame, 14, 20, 18) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 3, color: C.muted }}>
              FILE TREE
            </span>
            <span style={{ fontFamily: F.sans, fontSize: 12.5, color: C.muted }}>
              一个技能 = 一个文件夹
            </span>
          </div>
          {TREE.map((row, i) => (
            <div
              key={row.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 12px",
                marginBottom: 6,
                borderRadius: 9,
                backgroundColor: row.core ? C.accentSoft : "#FAFAFD",
                border: `1px ${row.core ? "solid" : "dashed"} ${row.core ? C.accentLine : C.line}`,
                ...rise(frame, 24 + i * 7, 12, 14),
              }}
            >
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 15,
                  fontWeight: row.core ? 500 : 400,
                  color: row.color,
                  width: 168,
                  paddingLeft: row.indent * 14,
                  whiteSpace: "pre",
                }}
              >
                {row.text}
              </span>
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 14,
                  color: row.core ? C.accent : C.body2,
                  fontWeight: row.core ? 700 : 400,
                }}
              >
                {row.tag}
              </span>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ position: "absolute", left: 704, right: 64, top: 210 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: 3,
            color: C.muted,
            marginBottom: 12,
            ...rise(frame, 18, 10, 14),
          }}
        >
          三条规矩
        </div>
        {RULES.map((r, i) => (
          <div
            key={r.t}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 10,
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              border: `1px solid ${C.line}`,
              boxShadow: "0 2px 4px rgba(20,24,31,0.03), 0 10px 24px rgba(20,24,31,0.05)",
              ...rise(frame, 34 + i * 9, 16, 16),
            }}
          >
            <StepNo n={i + 1} size={26} color={i === 0 ? C.accent : C.ink2} bg={i === 0 ? C.accentSoft : "#EFEDF3"} />
            <div>
              <div style={{ fontFamily: F.sans, fontSize: 17, fontWeight: 900, color: C.ink }}>
                {r.t}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 13.5, color: C.ink2, marginTop: 4, lineHeight: 1.5 }}>
                {r.s}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 4,
            padding: "10px 14px",
            borderRadius: 10,
            backgroundColor: C.blueSoft,
            border: `1px solid ${C.blueLine}`,
            fontFamily: F.sans,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: C.ink2,
            ...rise(frame, 74, 12, 16),
          }}
        >
          <span style={{ fontFamily: F.mono, color: C.blue, fontWeight: 500 }}>frontmatter</span>
          {" "}是 SKILL.md 开头几行：name 与 description 必填。
        </div>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};