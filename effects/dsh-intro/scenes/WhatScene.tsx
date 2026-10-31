import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";

/** 终端窗口：聊天 + 工具调用，一眼看懂“它是什么” */
const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { kind: "user" as const, text: "把这周的视频素材剪成 3 条竖版短视频" },
    { kind: "tool" as const, text: "读目录 · ls References/", tag: "tool" },
    { kind: "tool" as const, text: "转码 · ffmpeg -i input.mp4 ...", tag: "bash" },
    { kind: "todo" as const, text: "计划 · 检测黑场 → 切片 → 加字幕", tag: "todo" },
    { kind: "done" as const, text: "完成 · 已导出 3 条到 out/shorts/" },
  ];

  return (
    <Card style={{ width: 660, height: 424, overflow: "hidden", padding: 0 }}>
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 18px",
          backgroundColor: "#FBFAF7",
        }}
      >
        {["#E8A08A", "#EBCF8C", "#A9CDB0"].map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: 99, backgroundColor: c }} />
        ))}
        <span
          style={{
            marginLeft: 12,
            fontFamily: F.mono,
            fontSize: 12,
            color: C.muted,
          }}
        >
          dsh — ~/AIWorkspace/Remotion-projects
        </span>
      </div>

      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((line, i) => {
          const start = 22 + i * 13;
          const pop = spring({ frame: frame - start, fps, config: { damping: 18 } });
          if (frame < start) {
            return null;
          }
          return (
            <div
              key={line.text}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                opacity: pop,
                translate: `0px ${(1 - pop) * 10}px`,
                fontFamily: F.sans,
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              {line.kind === "user" ? (
                <>
                  <Tag color={C.ink} bg="#F1EFEA" mono>
                    you
                  </Tag>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{line.text}</span>
                </>
              ) : null}
              {line.kind === "tool" ? (
                <>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 99,
                      backgroundColor: C.blue,
                      marginTop: 9,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: C.ink2, fontFamily: F.mono, fontSize: 14 }}>{line.text}</span>
                  <Tag color={C.blue} bg={C.blueSoft} mono>
                    {line.tag}
                  </Tag>
                </>
              ) : null}
              {line.kind === "todo" ? (
                <>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 99,
                      backgroundColor: C.accent,
                      marginTop: 9,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: C.ink2, fontFamily: F.mono, fontSize: 14 }}>{line.text}</span>
                  <Tag color={C.accent} bg={C.accentSoft} mono>
                    {line.tag}
                  </Tag>
                </>
              ) : null}
              {line.kind === "done" ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 99,
                      backgroundColor: C.green,
                      color: "white",
                      fontSize: 11,
                      display: "grid",
                      placeItems: "center",
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{line.text}</span>
                </>
              ) : null}
            </div>
          );
        })}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
            opacity: interpolate(frame, [90, 100], [0, 1], clamp),
          }}
        >
          <span style={{ color: C.accent, fontFamily: F.mono, fontSize: 15 }}>›</span>
          <span
            style={{
              width: 9,
              height: 18,
              backgroundColor: C.ink,
              opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.15,
            }}
          />
        </div>
      </div>
    </Card>
  );
};

const POINTS = [
  { k: "跑在终端", v: "一个 CLI，接管你的文件与命令" },
  { k: "自带工具", v: "读写文件、跑命令、搜索网页" },
  { k: "会记住", v: "跨会话保存偏好与经验" },
];

/** 03 它是什么 */
export const WhatScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={0} />
      <SceneTitle label="WHAT · 它是什么" title="它到底是什么？" accent="它到底是什么？" />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 214,
          ...rise(frame, 16, 30, 18),
        }}
      >
        <Terminal />
      </div>

      <div
        style={{
          position: "absolute",
          right: 64,
          top: 208,
          width: 404,
          fontFamily: F.sans,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.5,
            ...rise(frame, 26, 20, 16),
          }}
        >
          把它想成一个
          <span style={{ color: C.accent }}>会动手的同事</span>
          ：你说目标，它自己拆步骤、调工具。
        </div>
        {POINTS.map((p, i) => (
          <Card
            key={p.k}
            style={{
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              ...rise(frame, 40 + i * 10, 18, 16),
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                backgroundColor: i === 0 ? C.accentSoft : i === 1 ? C.blueSoft : C.purpleSoft,
                color: i === 0 ? C.accent : i === 1 ? C.blue : C.purple,
                display: "grid",
                placeItems: "center",
                fontFamily: F.mono,
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{p.k}</div>
              <div style={{ fontSize: 14, color: C.muted, marginTop: 2 }}>{p.v}</div>
            </div>
          </Card>
        ))}
      </div>

      <CaptionPill text="它不是一个聊天框，而是一个能在终端里干活的智能体" start={44} />
    </SceneFrame>
  );
};