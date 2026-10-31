import { interpolate, useCurrentFrame } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { progress, rise } from "../theme-helpers";

const LAYERS = [
  {
    key: "skill",
    title: "Skill",
    desc: "多个动作串成的一整套流程",
    sample: "「生成一份教学微课」",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
    height: 100,
  },
  {
    key: "tool",
    title: "Tool",
    desc: "单个动作，如搜索、读文件",
    sample: "read_file / search",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
    height: 84,
  },
  {
    key: "prompt",
    title: "Prompt",
    desc: "一次性的指令，单次生效",
    sample: "「帮我总结这段材料」",
    color: C.muted,
    bg: "#EFEDF3",
    line: C.line,
    height: 68,
  },
];

const CHIPS = [
  "完成封装",
  "可插拔",
  "可复用",
  "把固定工作流固化下来",
];

/** 03 什么是 Skill：一句话定义 + 分层堆叠 + 一句话类比 */
export const WhatScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const grow = progress(frame, 24, 52);

  return (
    <SceneFrame>
      <Nav chapter={0} label="是什么" page={nav.page} total={nav.total} />
      <SceneTitle label="WHAT · 定义" title="Skill：把一套做法固化下来" accent="固化下来" />

      <div style={{ position: "absolute", left: 64, top: 206, width: 560 }}>
        <Card style={{ padding: "24px 26px", ...rise(frame, 14, 20, 18) }}>
          <div style={{ fontFamily: F.sans, fontSize: 20, lineHeight: 1.62, color: C.ink }}>
            Skill 是<span style={{ fontWeight: 900, color: C.accent }}>封装完成</span>、
            <span style={{ fontWeight: 900, color: C.accent }}>可插拔</span>、
            <span style={{ fontWeight: 900, color: C.accent }}>可复用</span>的专项能力包。
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: F.sans,
              fontSize: 17,
              lineHeight: 1.6,
              color: C.ink2,
            }}
          >
            它把固定工作流固化下来，
            <span style={{ borderBottom: `2px solid ${C.accentLine}`, paddingBottom: 1 }}>
              不必每次重写提示词
            </span>
            。
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {CHIPS.map((c, i) => (
              <span
                key={c}
                style={{
                  opacity: Math.min(1, Math.max(0, (frame - 40 - i * 6) / 10)),
                  translate: `0px ${interpolate(frame, [40 + i * 6, 52 + i * 6], [10, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px`,
                }}
              >
                <Tag color={C.accent} bg={C.accentSoft}>
                  {c}
                </Tag>
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ position: "absolute", left: 672, right: 64, top: 206 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: 3,
            color: C.muted,
            marginBottom: 14,
            ...rise(frame, 20, 10, 14),
          }}
        >
          三者的关系 · 为什么它更高一层
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LAYERS.map((layer, i) => {
            const start = 26 + i * 12;
            const h = interpolate(grow, [i * 0.3, i * 0.3 + 0.4], [layer.height * 0.55, layer.height], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={layer.key}
                style={{
                  height: h,
                  borderRadius: 14,
                  backgroundColor: layer.bg,
                  border: `1px solid ${layer.line}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 20px",
                  overflow: "hidden",
                  opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                }}
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 24,
                    fontWeight: 900,
                    color: layer.color,
                    width: 96,
                    flexShrink: 0,
                  }}
                >
                  {layer.title}
                </span>
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 15.5,
                    color: C.ink,
                    fontWeight: 600,
                    flex: 1,
                  }}
                >
                  {layer.desc}
                </span>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 12.5,
                    color: C.ink2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {layer.sample}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 672,
          right: 64,
          top: 500,
          padding: "14px 20px",
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.78)",
          border: `1px dashed ${C.accentLine}`,
          fontFamily: F.sans,
          ...rise(frame, 74, 12, 16),
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: C.accent, letterSpacing: 1 }}>
          一句话类比
        </span>
        <div style={{ fontSize: 16, color: C.ink, marginTop: 5, lineHeight: 1.45 }}>
          Agent 是员工，Skill 就是员工手里的
          <span style={{ fontWeight: 900 }}>专业工作手册</span>——上岗照着做，不用从零摸索。
        </div>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};