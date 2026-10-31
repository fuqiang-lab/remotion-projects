import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Card, SceneFrame, SceneTitle, Tag } from "../ui";

/** 版式样本 1：对比页（允许 / 只读） */
export const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame padBottom={124}>
      <SceneTitle label="COMPARE · 对比页" title="两张卡，讲清一条边界" accent="一条边界" />

      <div style={{ position: "absolute", left: 200, top: 220, display: "flex", gap: 32 }}>
        {[
          {
            title: "可以写",
            en: "allowed",
            color: C.green,
            bg: C.greenSoft,
            items: ["src/", "effects/", "public/", "out/"],
            note: "工作区内的路径",
            ok: true,
          },
          {
            title: "只能读",
            en: "read-only",
            color: C.muted,
            bg: "#EFEDF3",
            items: ["C:\\Program Files\\", "~/.ssh/", "D:\\其他项目\\"],
            note: "越界要先审批",
            ok: false,
          },
        ].map((side, i) => {
          const start = 14 + i * 12;
          const pop = spring({ frame: frame - start, fps, config: { damping: 16 } });
          return (
            <Card
              key={side.title}
              style={{
                width: 400,
                height: 250,
                padding: 26,
                opacity: Math.min(1, Math.max(0, (frame - start) / 10)),
                translate: `0px ${(1 - pop) * 26}px`,
                borderLeft: `4px solid ${side.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: F.sans, fontSize: 26, fontWeight: 900, color: C.ink }}>
                  {side.title}
                </span>
                <Tag color={side.color} bg={side.bg} mono>
                  {side.en}
                </Tag>
              </div>
              <div style={{ marginTop: 16, fontFamily: F.mono, fontSize: 14, color: C.ink2, lineHeight: 2 }}>
                {side.items.map((it) => (
                  <div key={it} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: side.color }}>{side.ok ? "✓" : "·"}</span>
                    {it}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontFamily: F.sans, fontSize: 14, color: C.muted }}>
                {side.note}
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 500,
          width: "100%",
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 15,
          color: C.ink2,
          ...rise(frame, 80, 12, 16),
        }}
      >
        版式 4 / 6：<span style={{ color: C.accent, fontWeight: 800 }}>对比页</span>
        <span style={{ color: C.muted }}> · 左右并列，靠左侧色条区分语义</span>
      </div>

      <CaptionPill text="允许做什么、只能做什么，一眼就能分清" start={44} />
    </SceneFrame>
  );
};