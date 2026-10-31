import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

const COLS = [
  {
    key: "global",
    title: "全局安装",
    sub: "装一次，本机所有项目都能用",
    pos: "用户目录下的共享技能目录",
    fit: "通用能力：做 PPT、读文档",
    ana: "装在自己电脑上的办公软件",
    anchor: "本机所有项目",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    key: "project",
    title: "项目安装",
    sub: "只对当前项目生效，跟着文件夹走",
    pos: "项目文件夹内的隐藏目录",
    fit: "只服务这门课 / 这个课题的能力",
    ana: "项目文件夹里自带的资料",
    anchor: "这门课 / 这个课题",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
];

/** 08 装在哪儿：全局 vs 项目，两卡对比 */
export const WhereScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame>
      <Nav chapter={2} label="装在哪" page={nav.page} total={nav.total} />
      <SceneTitle
        label="SCOPE · 作用域"
        title="两个位置，两种作用域"
        accent="两种作用域"
      />

      <div style={{ position: "absolute", left: 64, top: 214, display: "flex", gap: 24 }}>
        {COLS.map((col, i) => {
          const start = 26 + i * 14;
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <Card
              key={col.key}
              style={{
                width: 552,
                height: 322,
                padding: "22px 24px",
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 26}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    backgroundColor: col.bg,
                    border: `1px solid ${col.line}`,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: col.color }} />
                </span>
                <span style={{ fontFamily: F.sans, fontSize: 27, fontWeight: 900, color: C.ink }}>
                  {col.title}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: F.sans,
                    fontSize: 12.5,
                    color: col.color,
                    backgroundColor: col.bg,
                    border: `1px solid ${col.line}`,
                    padding: "3px 9px",
                    borderRadius: 6,
                    fontWeight: 700,
                  }}
                >
                  作用于 {col.anchor}
                </span>
              </div>

              <div style={{ fontFamily: F.sans, fontSize: 15, color: C.ink2, marginTop: 10 }}>
                {col.sub}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: `1px solid ${C.line}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                }}
              >
                {[
                  { k: "位置", v: col.pos },
                  { k: "适合", v: col.fit },
                  { k: "类比", v: col.ana },
                ].map((row) => (
                  <div key={row.k} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: C.muted,
                        letterSpacing: 1,
                        width: 32,
                        flexShrink: 0,
                        paddingTop: 2,
                      }}
                    >
                      {row.k}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: 15.5, color: C.ink, lineHeight: 1.5 }}>
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 552,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 20px",
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          border: `1px solid ${C.line}`,
          boxShadow: "0 2px 4px rgba(20,24,31,0.03), 0 10px 24px rgba(20,24,31,0.05)",
          ...rise(frame, 76, 12, 16),
        }}
      >
        <span
          style={{
            fontFamily: F.sans,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: "#FFFFFF",
            backgroundColor: C.ink,
            padding: "5px 10px",
            borderRadius: 6,
          }}
        >
          换电脑 / 换人接手
        </span>
        <span style={{ fontFamily: F.sans, fontSize: 16, color: C.ink2 }}>
          只有 <span style={{ fontWeight: 900, color: C.blue }}>项目安装</span> 会跟着文件夹走。
        </span>
      </div>

      <CaptionPill text={line.text} start={44} />
    </SceneFrame>
  );
};