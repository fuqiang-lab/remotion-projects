import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle } from "../ui";

const STEPS = [
  { label: "安装", cmd: "npm i -g dsh", hint: "拿到 dsh 命令", color: C.ink },
  { label: "启动", cmd: "dsh", hint: "在项目目录里打开", color: C.blue },
  { label: "说目标", cmd: "帮我整理这周的笔记", hint: "用自然语言就行", color: C.accent },
  { label: "看进度", cmd: "Ctrl+O 展开详情", hint: "工具调用实时可见", color: C.purple },
  { label: "验收", cmd: "审查 diff → 确认", hint: "改动由你拍板", color: C.green },
];

/** 等轴测地台，参考视频里那块淡蓝色“桌面” */
const Plane: React.FC<{ appear: number }> = ({ appear }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 700,
        top: 386,
        width: 620,
        height: 420,
        transform: "translate(-50%, -50%)",
        opacity: appear,
        scale: String(interpolate(appear, [0, 1], [0.92, 1])),
      }}
    >
      <svg width="620" height="420" viewBox="0 0 620 420">
        <defs>
          <linearGradient id="planeTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DCEEF9" />
            <stop offset="100%" stopColor="#B9D8EE" />
          </linearGradient>
          <linearGradient id="planeSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.planeEdge} />
            <stop offset="100%" stopColor="#8FBCDC" />
          </linearGradient>
        </defs>
        {/* 侧边厚度 */}
        <path d="M310 396 L548 264 L548 288 L310 420 Z" fill="url(#planeSide)" opacity="0.75" />
        <path d="M310 396 L72 264 L72 288 L310 420 Z" fill="#A5C6DF" opacity="0.6" />
        {/* 台面 */}
        <path d="M310 132 L548 264 L310 396 L72 264 Z" fill="url(#planeTop)" />
        <path
          d="M310 132 L548 264 L310 396 L72 264 Z"
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={1.5}
        />
        <g opacity={0.22} stroke="#FFFFFF" strokeWidth={1}>
          <path d="M191 198 L429 330" />
          <path d="M310 165 L310 363" />
          <path d="M250 231 L250 297" />
          <path d="M370 231 L370 297" />
        </g>
      </svg>

      {/* 台面上的文件夹与终端卡片 */}
      {[
        { x: 168, y: 210, w: 96, h: 66, label: "project/" },
        { x: 322, y: 300, w: 112, h: 70, label: "terminal" },
        { x: 430, y: 224, w: 84, h: 58, label: "notes/" },
      ].map((b, i) => {
        const s = spring({ frame: appear * 40 - i * 6, fps: 30, config: { damping: 16 } });
        return (
          <div
            key={b.label}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
              border: "1px solid #CFE2F0",
              boxShadow: "0 6px 14px rgba(73,123,163,0.18)",
              fontFamily: F.mono,
              fontSize: 11,
              color: C.ink2,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 6,
              transform: "skewX(-0deg)",
              opacity: s,
              translate: `0px ${(1 - s) * -26}px`,
            }}
          >
            <span style={{ position: "absolute", top: 8, left: 8, color: C.accent }}>▸</span>
            {b.label}
          </div>
        );
      })}
    </div>
  );
};

/** 05 五步上手 */
export const QuickStartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const planeAppear = interpolate(frame, [10, 34], [0, 1], clamp);
  const typeCount = Math.round(
    interpolate(frame, [100, 168], [0, STEPS[2].cmd.length], clamp),
  );

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={2} />
      <SceneTitle label="STEP · 五步上手" title="五步，从零开始跑起来" accent="五步" />

      <div style={{ position: "absolute", left: 64, top: 212, width: 520 }}>
        {STEPS.map((s, i) => {
          const start = 16 + i * 11;
          const pop = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.7 } });
          const current = frame >= 100 && frame < 170 ? 2 : -1;
          return (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 14px",
                marginBottom: 7,
                borderRadius: 12,
                backgroundColor: i === current ? "#FFFFFF" : "transparent",
                border: `1px solid ${i === current ? s.color : "transparent"}`,
                boxShadow: i === current ? "0 10px 24px rgba(20,24,31,0.08)" : undefined,
                opacity: Math.min(1, Math.max(0, (frame - start) / 10)),
                translate: `0px ${(1 - pop) * 16}px`,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  border: `1.5px solid ${s.color}`,
                  color: s.color,
                  fontFamily: F.mono,
                  fontSize: 12,
                  fontWeight: 700,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 20, fontWeight: 900, color: C.ink }}>
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: 13,
                      color: i === 2 ? C.accent : C.ink2,
                      backgroundColor: i === 2 ? C.accentSoft : "#F1EFEA",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {i === 2 ? s.cmd.slice(0, typeCount) : s.cmd}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 13.5,
                    color: C.muted,
                    marginTop: 3,
                  }}
                >
                  {s.hint}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Plane appear={planeAppear} />

      <div
        style={{
          position: "absolute",
          right: 64,
          top: 168,
          ...rise(frame, 14, 10, 14),
        }}
      >
        <Card style={{ padding: "10px 16px", borderRadius: 999 }}>
          <span style={{ fontFamily: F.sans, fontSize: 14, color: C.ink2 }}>
            <span style={{ color: C.accent, marginRight: 8 }}>◉</span>
            对一个 Agent 来说：准备好文件夹就够了
          </span>
        </Card>
      </div>

      <CaptionPill text="装好、开一个文件夹、把目标说清楚，剩下的交给它" start={54} />
    </SceneFrame>
  );
};