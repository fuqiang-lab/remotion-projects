import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame } from "../ui";

const CARDS = [
  { no: "01", art: "›_", title: "它是什么", sub: "终端里会干活的智能体", color: C.accent, bg: C.accentSoft },
  { no: "02", art: "↻", title: "核心能力", sub: "推理 → 调工具 → 检查 → 再推进", color: C.blue, bg: C.blueSoft },
  { no: "03", art: "[ ]", title: "五步上手", sub: "装 → 启动 → 说目标 → 看进度 → 验收", color: C.green, bg: C.greenSoft },
  { no: "04", art: "✦", title: "技能与记忆", sub: "按需加载，跨会话记得住", color: C.purple, bg: C.purpleSoft },
  { no: "05", art: "⤢", title: "协作与收尾", sub: "并行、编排、汇报、恢复", color: C.accent, bg: C.accentSoft },
];

/** 10 回顾：五张卡片收束全片 */
export const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={null} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 116,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 5,
          color: C.muted,
          ...rise(frame, 6, 10, 14),
        }}
      >
        认识 DSH · 从原理到上手
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 156,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: -0.6,
          color: C.ink,
          ...rise(frame, 10, 18, 16),
        }}
      >
        记住{" "}
        <span style={{ color: C.accent }}>五件事</span>
        ，就够开始用了
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 250,
          display: "flex",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {CARDS.map((card, i) => {
          const start = 20 + i * 9;
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <Card
              key={card.no}
              style={{
                width: 216,
                height: 220,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 34}px`,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: F.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {card.art}
              </div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontFamily: F.mono, fontSize: 12, color: card.color, marginBottom: 6 }}>
                  {card.no}
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 23, fontWeight: 900, color: C.ink }}>
                  {card.title}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: F.sans,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: C.muted,
                  }}
                >
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
          left: 0,
          right: 0,
          top: 500,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 17,
          color: C.ink2,
          ...rise(frame, 80, 12, 16),
        }}
      >
        <span style={{ color: C.muted, marginRight: 10 }}>下一步</span>
        <span style={{ fontWeight: 800 }}>打开一个你熟悉的文件夹</span>
        <span style={{ color: C.muted, margin: "0 10px" }}>→</span>
        <span style={{ fontWeight: 800 }}>从一件小事说清楚开始</span>
      </div>

      <CaptionPill text="记住这五件，剩下的边用边学就好" start={54} />
    </SceneFrame>
  );
};