import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise, stagger } from "../theme";
import { CaptionPill, Card, SceneFrame, SceneTitle } from "../ui";

const CARDS = [
  { art: "Aa", title: "字号", sub: "主标题 46 / 正文 14", color: C.accent, bg: C.accentSoft },
  { art: "#F4", title: "底色", sub: "冷米白 #F4F3F8", color: C.blue, bg: C.blueSoft },
  { art: "◻", title: "卡片", sub: "白底 16 圆角 + 双层阴影", color: C.green, bg: C.greenSoft },
  { art: "▭", title: "字幕", sub: "深灰胶囊 #343C4A", color: C.purple, bg: C.purpleSoft },
];

/** 版式样本 2：卡片网格页 */
export const GridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame padBottom={124}>
      <SceneTitle label="GRID · 卡片网格页" title="四个元素，撑起一屏版式" accent="撑起一屏" />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 236,
          display: "flex",
          gap: 18,
        }}
      >
        {CARDS.map((card, i) => {
          const start = stagger(18, i, 9);
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <Card
              key={card.title}
              style={{
                width: 272,
                height: 230,
                padding: 22,
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 30}px`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: F.mono,
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                {card.art}
              </div>
              <div style={{ marginTop: 26 }}>
                <div style={{ fontFamily: F.sans, fontSize: 23, fontWeight: 900, color: C.ink }}>
                  {card.title}
                </div>
                <div style={{ marginTop: 6, fontFamily: F.sans, fontSize: 14, color: C.muted }}>
                  {card.sub}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 500,
          fontFamily: F.sans,
          fontSize: 15,
          color: C.ink2,
          ...rise(frame, 76, 12, 16),
        }}
      >
        版式 2 / 6：<span style={{ color: C.accent, fontWeight: 800 }}>卡片网格页</span>
        <span style={{ color: C.muted }}> · 3–5 张等宽卡，图标用语义色区分</span>
      </div>

      <CaptionPill text="一屏一件事：把变量拆成四张一样的卡" start={44} />
    </SceneFrame>
  );
};