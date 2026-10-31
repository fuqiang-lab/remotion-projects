import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { progress, rise } from "../theme-helpers";

const LEVELS = [
  {
    no: "1",
    when: "常驻",
    what: "名称 + 描述",
    desc: "会话一开始就在上下文里。只有一两行，模型据此判断「要不要用」。",
    note: "每一轮都在",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    no: "2",
    when: "按需",
    what: "SKILL.md 正文",
    desc: "命中任务后才读进来。流程、约束、输出要求都在这一层。",
    note: "命中才读",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
  {
    no: "3",
    when: "再按需",
    what: "resources / scripts",
    desc: "正文里写明「需要时才读」，才去读参考或跑脚本。",
    note: "真的需要才取",
    color: C.green,
    bg: C.greenSoft,
    line: C.greenLine,
  },
];

const BOOK = ["目录页", "章节正文", "附录附件"];

/** 06 三级渐进加载：先看目录 → 再看章节 → 最后翻附件 */
export const LoadingScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flow = progress(frame, 30, 96);

  return (
    <SceneFrame>
      <Nav chapter={1} label="怎么加载" page={nav.page} total={nav.total} />
      <SceneTitle
        label="LOADING · 渐进加载"
        title="三级渐进加载，按需打开"
        accent="按需打开"
      />

      <div style={{ position: "absolute", left: 64, right: 64, top: 296 }}>
        {/* 横向流动的细线：三级依次点亮 */}
        <svg
          width={L_WIDTH}
          height={20}
          style={{ position: "absolute", left: 0, top: 82, overflow: "visible" }}
        >
          {[0, 1].map((i) => {
            const x1 = 378 + 20 + i * 398 + 4;
            const x2 = x1 + 12;
            return (
              <path
                key={i}
                d={`M${x1} 6 L${x2} 10 L${x1} 14`}
                stroke={C.accent}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={flow}
              />
            );
          })}
        </svg>

        <div style={{ display: "flex", gap: 20, position: "relative" }}>
          {LEVELS.map((lv, i) => {
            const start = 34 + i * 14;
            const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
            const lit = Math.min(1, Math.max(0, (frame - start) / 12));
            return (
              <Card
                key={lv.no}
                style={{
                  width: 378,
                  height: 200,
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  opacity: Math.min(1, Math.max(0.25, lit)),
                  translate: `0px ${(1 - pop) * 26}px`,
                  border: `1px solid ${lit > 0.9 ? lv.line : C.line}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      backgroundColor: lv.bg,
                      color: lv.color,
                      border: `1px solid ${lv.line}`,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: F.mono,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {lv.no}
                  </span>
                  <Tag color={lv.color} bg={lv.bg}>
                    {lv.when}
                  </Tag>
                  <span style={{ marginLeft: "auto", fontFamily: F.sans, fontSize: 12.5, color: C.muted }}>
                    {lv.note}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    fontFamily: F.mono,
                    fontSize: 19,
                    fontWeight: 500,
                    color: C.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {lv.what}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: F.sans,
                    fontSize: 14.5,
                    lineHeight: 1.62,
                    color: C.ink2,
                  }}
                >
                  {lv.desc}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    fontFamily: F.sans,
                    fontSize: 12.5,
                    color: lv.color,
                    fontWeight: 700,
                  }}
                >
                  像查手册：{BOOK[i]}
                </div>
              </Card>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: F.sans,
            fontSize: 16,
            color: C.ink2,
            ...rise(frame, 82, 12, 16),
          }}
        >
          <span style={{ color: C.muted, letterSpacing: 2, fontSize: 13 }}>像查手册</span>
          {BOOK.map((b, i) => (
            <span key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i > 0 ? <span style={{ color: C.accent, fontWeight: 800 }}>→</span> : null}
              <span style={{ fontWeight: 700 }}>{b}</span>
            </span>
          ))}
          <span style={{ color: C.muted }}>；三级都只在</span>
          <span style={{ fontWeight: 900, color: C.accent }}>需要时</span>
          <span style={{ color: C.muted }}>才发生。</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 206,
          width: L_WIDTH,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 20px",
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.72)",
          border: `1px dashed ${C.line}`,
          fontFamily: F.sans,
          fontSize: 13.5,
          color: C.muted,
          ...rise(frame, 22, 10, 14),
        }}
      >
        <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 2, color: C.accent }}>
          口诀
        </span>
        <span style={{ color: C.ink, fontWeight: 800 }}>「渐进」的含义</span>
        <span>—— 每一级都只在真的需要时才发生，而不是一次全部加载完。</span>
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};

const L_WIDTH = 1280 - 128;