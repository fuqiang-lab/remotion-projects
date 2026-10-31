import { interpolate, useCurrentFrame } from "remotion";
import { C, F, clamp, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";

const MODES = [
  {
    name: "并行子代理",
    en: "subagent",
    desc: "把独立的活拆开，同时去做",
    color: C.blue,
    bg: C.blueSoft,
  },
  {
    name: "工作流编排",
    en: "workflow",
    desc: "几十个任务：分阶段、批量跑",
    color: C.purple,
    bg: C.purpleSoft,
  },
  {
    name: "定时提醒",
    en: "schedule",
    desc: "到点提醒，或定期重复一件事",
    color: C.accent,
    bg: C.accentSoft,
  },
];

const FINISH = [
  { k: "收尾汇报", v: "交付什么、验证了什么、还差什么", c: C.green, bg: C.greenSoft },
  { k: "会话恢复", v: "中途断了，接着上次继续", c: C.blue, bg: C.blueSoft },
  { k: "核对口径", v: "不确定的地方先问，不硬编", c: C.accent, bg: C.accentSoft },
];

/** 09 协作与收尾 */
export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={4} />
      <SceneTitle
        label="SCALE · 协作"
        title="活太多？它会自己分工、收尾"
        accent="自己分工、收尾"
      />

      {/* 协作方式 */}
      <div style={{ position: "absolute", left: 64, top: 208, display: "flex", gap: 16 }}>
        {MODES.map((m, i) => {
          const start = 16 + i * 10;
          const grow = interpolate(frame, [50 + i * 10, 78 + i * 10], [0, 1], clamp);
          return (
            <Card
              key={m.name}
              style={{
                width: 244,
                padding: 20,
                ...rise(frame, start, 26, 18),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: F.sans, fontSize: 20, fontWeight: 900, color: C.ink }}>
                  {m.name}
                </span>
                <Tag color={m.color} bg={m.bg} mono>
                  {m.en}
                </Tag>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: F.sans,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: C.muted,
                  minHeight: 42,
                }}
              >
                {m.desc}
              </div>

              {/* 分工示意图 */}
              <div
                style={{
                  marginTop: 14,
                  height: 76,
                  borderRadius: 10,
                  backgroundColor: "#FAF9F6",
                  border: `1px solid ${C.line}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {i === 0 ? (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: 28,
                        width: 22,
                        height: 22,
                        borderRadius: 7,
                        backgroundColor: C.blue,
                      }}
                    />
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        style={{
                          position: "absolute",
                          left: 52 + 50 * j,
                          top: 22,
                          width: 36,
                          height: 32,
                          borderRadius: 7,
                          border: `1.5px solid ${C.blue}`,
                          backgroundColor: "#FFFFFF",
                          opacity: grow * (j <= Math.floor(grow * 3) ? 1 : 0.25),
                        }}
                      />
                    ))}
                  </>
                ) : null}
                {i === 1 ? (
                  <div style={{ position: "absolute", inset: 0, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {[0, 1, 2].map((row) => (
                      <div key={row} style={{ display: "flex", gap: 6 }}>
                        {[0, 1, 2, 3, 4].map((col) => {
                          const step = row * 5 + col;
                          const filled = grow * 15 > step;
                          return (
                            <span
                              key={col}
                              style={{
                                width: 30,
                                height: 12,
                                borderRadius: 3,
                                backgroundColor: filled ? C.purple : "#E7E3DA",
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : null}
                {i === 2 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      fontFamily: F.mono,
                      fontSize: 12,
                      color: C.ink2,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: C.accent, fontSize: 15 }}>06:30</span>
                    <span style={{ opacity: 0.4 }}>→</span>
                    <span style={{ opacity: 0.7 }}>09:00</span>
                    <span style={{ opacity: 0.4 }}>→</span>
                    <span style={{ opacity: 0.4 }}>12:00</span>
                  </div>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 收尾 */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 484,
          padding: "16px 20px",
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.78)",
          border: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          ...rise(frame, 78, 18, 18),
        }}
      >
        <div style={{ fontFamily: F.sans, fontSize: 17, fontWeight: 900, color: C.ink, width: 96 }}>
          最后一步
        </div>
        {FINISH.map((f) => (
          <div
            key={f.k}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              backgroundColor: f.bg,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                backgroundColor: f.c,
                color: "white",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
              }}
            >
              ✓
            </span>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 800, color: C.ink }}>
                {f.k}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: C.ink2, marginTop: 2 }}>
                {f.v}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CaptionPill text="大任务能拆开并行跑，跑完还给你一份能验收的交代" start={40} />
    </SceneFrame>
  );
};