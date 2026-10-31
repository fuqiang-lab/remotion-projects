import { useCurrentFrame } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

const GOOD = [
  { text: "C:\\Users\\<用户名>\\.agents\\skills\\", kind: "root" },
  { text: "└─ demo-skill/", kind: "dir", note: "技能目录（名字随意，建议小写）" },
  { text: "   ├─ SKILL.md", kind: "file", note: "必须；缺它就不算 Skill" },
  { text: "   ├─ references/", kind: "opt", note: "可选" },
  { text: "   └─ scripts/", kind: "opt", note: "可选" },
];

const WRONG = [
  { tag: "多套一层", code: "skills/demo-skill/demo-skill/SKILL.md" },
  { tag: "少一层", code: "skills/SKILL.md（直接扔进根目录）" },
];

/** 10 目录结构：正确树 + 两种装错 */
export const LayoutScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame>
      <Nav chapter={2} label="装在哪" page={nav.page} total={nav.total} />
      <SceneTitle
        label="LAYOUT · 结构"
        title="正好两层，多一层就找不到"
        accent="多一层就找不到"
      />

      <div style={{ position: "absolute", left: 64, top: 214, width: 560 }}>
        <Card style={{ padding: "20px 22px", ...rise(frame, 16, 20, 18) }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 3, color: C.muted }}>
              装对一个 Skill
            </span>
            <span
              style={{
                fontFamily: F.sans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
                color: C.green,
                backgroundColor: C.greenSoft,
                padding: "3px 9px",
                borderRadius: 6,
              }}
            >
              ✓ 正好两层
            </span>
          </div>

          {GOOD.map((row, i) => {
            const isFile = row.kind === "file";
            return (
              <div
                key={row.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  marginBottom: 6,
                  borderRadius: 8,
                  backgroundColor: isFile ? C.accentSoft : "transparent",
                  border: `1px ${isFile ? "solid" : "dashed"} ${isFile ? C.accentLine : "transparent"}`,
                  ...rise(frame, 26 + i * 7, 12, 14),
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 15,
                    whiteSpace: "pre",
                    color: isFile ? C.accent : row.kind === "root" ? C.ink : C.ink2,
                    fontWeight: isFile ? 500 : 400,
                  }}
                >
                  {row.text}
                </span>
                {row.note ? (
                  <span
                    style={{
                      fontFamily: F.sans,
                      fontSize: 12.5,
                      color: isFile ? C.accent : C.body2,
                      fontWeight: isFile ? 700 : 400,
                      marginLeft: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.note}
                  </span>
                ) : null}
              </div>
            );
          })}
        </Card>

        <div
          style={{
            marginTop: 14,
            padding: "12px 16px",
            borderRadius: 10,
            backgroundColor: C.blueSoft,
            border: `1px solid ${C.blueLine}`,
            fontFamily: F.sans,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: C.ink2,
            ...rise(frame, 68, 12, 16),
          }}
        >
          结构规则：必须是「技能目录 / SKILL.md」
          <span style={{ fontWeight: 900, color: C.blue }}>正好两层</span>。
          <span style={{ color: C.muted }}>（DeepSeek Harness 官方文档：发现深度为一层）</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 664, right: 64, top: 214, width: 552 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: 3,
            color: C.muted,
            marginBottom: 12,
            ...rise(frame, 20, 10, 14),
          }}
        >
          常见两种装错
        </div>

        {WRONG.map((w, i) => (
          <Card
            key={w.tag}
            style={{
              padding: "15px 18px 16px",
              marginBottom: 12,
              borderLeft: `3px solid ${C.accent}`,
              ...rise(frame, 32 + i * 12, 18, 16),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: C.accentSoft,
                  color: C.accent,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                ×
              </span>
              <span style={{ fontFamily: F.sans, fontSize: 17, fontWeight: 900, color: C.ink }}>
                {i === 0 ? "多套一层" : "少一层"}
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: F.mono,
                fontSize: 12.5,
                color: C.ink2,
                backgroundColor: "#FAFAFD",
                border: `1px dashed ${C.line}`,
                borderRadius: 8,
                padding: "9px 11px",
                wordBreak: "break-all",
              }}
            >
              {w.code}
            </div>
            <div style={{ marginTop: 9, fontFamily: F.sans, fontSize: 13, lineHeight: 1.5, color: C.body2 }}>
              {i === 0
                ? "多套一层 → 扫描只到第一层，找不到 SKILL.md"
                : "少一层 → 根目录里的 SKILL.md 不属于任何技能"}
            </div>
          </Card>
        ))}

        <div
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            backgroundColor: C.greenSoft,
            border: `1px solid ${C.greenLine}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            ...rise(frame, 72, 12, 16),
          }}
        >
          <span style={{ fontFamily: F.sans, fontSize: 20, color: C.green, fontWeight: 900 }}>✓</span>
          <span style={{ fontFamily: F.sans, fontSize: 14.5, lineHeight: 1.5, color: C.ink }}>
            复制时把<span style={{ fontWeight: 900 }}>含 SKILL.md 的那一层</span>整个搬过去，就对了。
          </span>
        </div>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};