import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";

const SKILLS = [
  { name: "remotion-create", group: "create", desc: "从零搭一个视频工程" },
  { name: "remotion-markup", group: "markup", desc: "文字、转场、动效规范" },
  { name: "office-docx", group: "office", desc: "读写 Word 文档" },
  { name: "xlsx", group: "office", desc: "表格数据与公式" },
  { name: "drawio", group: "diagram", desc: "流程图与架构图" },
  { name: "browser-skill", group: "browser", desc: "操控真实浏览器" },
  { name: "pdf", group: "doc", desc: "合并、填写、加密" },
  { name: "remotion-render", group: "render", desc: "导出 MP4 / WebM" },
];

const GROUP_COLOR: Record<string, string> = {
  create: C.accent,
  markup: C.accent,
  office: C.blue,
  diagram: C.blue,
  browser: C.purple,
  doc: C.green,
  render: C.green,
};

/** 06 技能：统一的流程，按需加载 */
export const SkillsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={3} />
      <SceneTitle label="SKILL · 技能系统" title="同一套方法，随用随加载" accent="随用随加载" />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 206,
          ...rise(frame, 14, 30, 18),
        }}
      >
        <Card style={{ width: 352, padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              fontFamily: F.sans,
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 900, color: C.ink }}>不在上下文里</span>
            <Tag color={C.muted} bg="#F1EFEA" mono>
              idle
            </Tag>
          </div>
          {[
            "AGENTS.md — 目录约定",
            "Skills 索引 — 只有一句话简介",
            "按需读取 REFERENCE.md",
          ].map((t, i) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                marginBottom: 8,
                borderRadius: 9,
                backgroundColor: "#FAF9F6",
                border: `1px dashed ${C.line}`,
                fontFamily: F.mono,
                fontSize: 13,
                color: C.ink2,
                ...rise(frame, 26 + i * 8, 12, 14),
              }}
            >
              <span style={{ color: C.muted }}>○</span>
              {t}
            </div>
          ))}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              backgroundColor: C.accentSoft,
              border: `1px solid ${C.accentLine}`,
              fontFamily: F.sans,
              ...rise(frame, 56, 14, 16),
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: C.accent, letterSpacing: 2 }}>
              需要时 → 载入
            </div>
            <div style={{ fontSize: 15, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>
              先读总表，再按场景读子技能，一次只加载相关的。
            </div>
          </div>
        </Card>
      </div>

      <div
        style={{
          position: "absolute",
          left: 456,
          right: 64,
          top: 200,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
        }}
      >
        {SKILLS.map((s, i) => {
          const start = 34 + i * 7;
          const pop = spring({ frame: frame - start, fps, config: { damping: 17, mass: 0.6 } });
          const color = GROUP_COLOR[s.group] ?? C.ink2;
          return (
            <Card
              key={s.name}
              style={{
                padding: 16,
                height: 132,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                opacity: Math.min(1, Math.max(0, (frame - start) / 10)),
                translate: `0px ${(1 - pop) * 22}px`,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  backgroundColor: `${color}1A`,
                  color,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontFamily: F.mono,
                }}
              >
                {s.name.slice(0, 1).toUpperCase()}
              </div>
              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.ink,
                    letterSpacing: -0.2,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    marginTop: 5,
                    fontFamily: F.sans,
                    fontSize: 13,
                    color: C.muted,
                    lineHeight: 1.45,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 456,
          right: 64,
          top: 534,
          display: "flex",
          gap: 10,
          fontFamily: F.sans,
          ...rise(frame, 96, 12, 16),
        }}
      >
        {[
          { t: "索引常驻", v: "几十个技能只占一张表" },
          { t: "正文按需", v: "读到才进上下文" },
          { t: "统一写法", v: "换模型也一样用" },
        ].map((x, i) => (
          <div
            key={x.t}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              border: `1px solid ${C.line}`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: F.mono, color: C.accent, fontSize: 12 }}>
              0{i + 1}
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{x.t}</span>
            <span style={{ fontSize: 12.5, color: C.muted }}>{x.v}</span>
          </div>
        ))}
      </div>

      <CaptionPill text="技能不是全都塞进去，而是用到哪个才加载哪个" start={50} />
    </SceneFrame>
  );
};