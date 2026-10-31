import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise, stagger } from "../theme-helpers";

const CARDS = [
  {
    no: "01",
    art: "包",
    q: "是什么",
    a: "把一套做法固化下来的可复用能力包",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    no: "02",
    art: "↓",
    q: "怎么加载",
    a: "目录常驻、正文按需、资源再按需——三级渐进",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
  {
    no: "03",
    art: "·",
    q: "装在哪",
    a: "全局放用户目录，项目放项目目录；先找 .agents\\skills",
    color: C.green,
    bg: C.greenSoft,
    line: C.greenLine,
  },
];

/** 13 三句话记住：三张卡收束 */
export const RecapScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame>
      <Nav chapter={null} label="小结" page={nav.page} total={nav.total} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 116,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 5,
          color: C.muted,
          ...rise(frame, 6, 10, 14),
        }}
      >
        小结 · 三句话
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 152,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: -0.6,
          color: C.ink,
          ...rise(frame, 10, 18, 16),
        }}
      >
        记住 <span style={{ color: C.accent }}>三句话</span> 就够了
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 252,
          display: "flex",
          gap: 20,
          justifyContent: "center",
        }}
      >
        {CARDS.map((card, i) => {
          const start = stagger(22, i, 10);
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <Card
              key={card.no}
              style={{
                width: 372,
                height: 226,
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 30}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: card.bg,
                    border: `1px solid ${card.line}`,
                    color: card.color,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: F.sans,
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  {card.art}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: 13, color: C.muted }}>{card.no}</span>
              </div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontFamily: F.sans, fontSize: 25, fontWeight: 900, color: C.ink }}>
                  {card.q}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: F.sans,
                    fontSize: 14.5,
                    lineHeight: 1.62,
                    color: C.ink2,
                  }}
                >
                  {card.a}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 508,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 16,
          color: C.muted,
          ...rise(frame, 70, 12, 16),
        }}
      >
        这三点之外，剩下的都可以边用边学
      </div>

      <CaptionPill text={line.text} start={40} />
    </SceneFrame>
  );
};