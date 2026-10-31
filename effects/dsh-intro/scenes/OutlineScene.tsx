import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame } from "../ui";

const ITEMS = [
  {
    no: "01",
    title: "它是什么",
    sub: "终端里的智能体",
    accent: C.accent,
    icon: (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="1" y="1" width="44" height="44" rx="13" fill={C.accentSoft} stroke={C.accentLine} />
        <path d="M13 17l6 6-6 6" stroke={C.accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 29h9" stroke={C.accent} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    no: "02",
    title: "核心能力",
    sub: "边想边做的代理循环",
    accent: C.blue,
    icon: (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="1" y="1" width="44" height="44" rx="13" fill={C.blueSoft} stroke="#B9CAF1" />
        <circle cx="23" cy="23" r="9" stroke={C.blue} strokeWidth="2.4" />
        <circle cx="23" cy="23" r="2.6" fill={C.blue} />
        <path d="M23 8v5M23 33v5M8 23h5M33 23h5" stroke={C.blue} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    no: "03",
    title: "五步上手",
    sub: "从装好到跑起来",
    accent: C.green,
    icon: (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="1" y="1" width="44" height="44" rx="13" fill={C.greenSoft} stroke="#AFDCC5" />
        <rect x="10" y="12" width="26" height="8" rx="2.5" stroke={C.green} strokeWidth="2.2" />
        <rect x="10" y="26" width="26" height="8" rx="2.5" stroke={C.green} strokeWidth="2.2" />
        <path d="M15 16h4M15 30h9" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    no: "04",
    title: "技能与记忆",
    sub: "越用越好用",
    accent: C.purple,
    icon: (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="1" y="1" width="44" height="44" rx="13" fill={C.purpleSoft} stroke="#CBBDF0" />
        <path d="M17 13h6v9h-6z" stroke={C.purple} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M23 18h7v15H17V22h6" stroke={C.purple} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="31" cy="14" r="3" fill={C.purple} />
      </svg>
    ),
  },
  {
    no: "05",
    title: "协作与收尾",
    sub: "大任务、收尾与恢复",
    accent: C.accent,
    icon: (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="1" y="1" width="44" height="44" rx="13" fill={C.accentSoft} stroke={C.accentLine} />
        <circle cx="17" cy="18" r="4.5" stroke={C.accent} strokeWidth="2.2" />
        <circle cx="29" cy="18" r="4.5" stroke={C.accent} strokeWidth="2.2" />
        <path d="M9 32c1.4-4 4.3-6 8-6s6.6 2 8 6M21 32c1.4-4 4.3-6 8-6s6.6 2 8 6" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

/** 02 导览：本次要讲清楚的五件事 */
export const OutlineScene: React.FC = () => {
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
          top: 128,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 5,
          color: C.muted,
          ...rise(frame, 6, 10, 14),
        }}
      >
        一次讲清 · 认识 DSH
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 172,
          textAlign: "center",
          fontFamily: F.sans,
          fontSize: 48,
          fontWeight: 900,
          letterSpacing: -0.8,
          color: C.ink,
          ...rise(frame, 10, 18, 16),
        }}
      >
        五个问题，看懂{" "}
        <span style={{ color: C.accent }}>DeepSeek Harness</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 292,
          display: "flex",
          gap: 20,
          justifyContent: "center",
        }}
      >
        {ITEMS.map((item, i) => {
          const start = 22 + i * 9;
          const pop = spring({
            frame: frame - start,
            fps,
            config: { damping: 16, mass: 0.7 },
          });
          return (
            <Card
              key={item.no}
              style={{
                width: 212,
                height: 218,
                padding: 22,
                opacity: Math.min(1, Math.max(0, (frame - start) / 12)),
                translate: `0px ${(1 - pop) * 30}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>{item.icon}</div>
              <div>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 13,
                    color: item.accent,
                    fontWeight: 500,
                    marginBottom: 8,
                  }}
                >
                  {item.no}
                </div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 27,
                    fontWeight: 900,
                    color: C.ink,
                    letterSpacing: -0.4,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: F.sans,
                    fontSize: 15,
                    color: C.muted,
                  }}
                >
                  {item.sub}
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
          bottom: 118,
          display: "flex",
          justifyContent: "center",
          gap: 10,
          fontFamily: F.sans,
          fontSize: 16,
          color: C.ink2,
          ...rise(frame, 70, 10, 14),
        }}
      >
        {["终端里跑", "有工具", "有记忆", "能并行"].map((t) => (
          <span
            key={t}
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              border: `1px dashed ${C.line}`,
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <CaptionPill text="接下来，用五个问题把它讲清楚" start={34} width={640} />
    </SceneFrame>
  );
};