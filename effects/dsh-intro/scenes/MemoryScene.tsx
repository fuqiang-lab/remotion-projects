import { interpolate, useCurrentFrame } from "remotion";
import { C, F, clamp, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";

const LAYERS = [
  {
    name: "项目记忆",
    scope: "project",
    desc: "这个仓库的约定：目录在哪、哪条规范优先",
    color: C.accent,
    bg: C.accentSoft,
  },
  {
    name: "会话记忆",
    scope: "thread",
    desc: "这次对话里的决定与临时结论",
    color: C.blue,
    bg: C.blueSoft,
  },
  {
    name: "长期偏好",
    scope: "global",
    desc: "跨项目复用的做法与踩过的坑",
    color: C.purple,
    bg: C.purpleSoft,
  },
];

const ROWS = [
  "所有新动画都放在 effects/ 目录下开发",
  "用户偏好：先预览确认，再渲染导出",
  "Windows 下用 Python 批量改元数据更稳",
  "校外导师名单口径不一致，填报前先核实",
];

/** 07 记忆：分层保存、按上下文召回 */
export const MemoryScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 一层层点亮的扫描
  const scan = Math.floor(interpolate(frame, [40, 200], [0, 3], clamp));
  // 新记忆落库
  const drop = interpolate(frame, [96, 122], [0, 1], clamp);

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={3} />
      <SceneTitle
        label="MEMORY · 记忆"
        title="它记得住，也分得清"
        accent="分得清"
      />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 204,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {LAYERS.map((l, i) => {
          const start = 18 + i * 10;
          const on = i === scan && frame > 40;
          return (
            <Card
              key={l.name}
              style={{
                padding: "16px 18px",
                borderLeft: `4px solid ${l.color}`,
                ...rise(frame, start, 22, 16),
                scale: String(on ? 1.02 : 1),
                boxShadow: on
                  ? `0 14px 30px ${l.color}1F`
                  : "0 2px 4px rgba(20,24,31,0.03), 0 14px 34px rgba(20,24,31,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: F.sans, fontSize: 19, fontWeight: 900, color: C.ink }}>
                  {l.name}
                </span>
                <Tag color={l.color} bg={l.bg} mono>
                  {l.scope}
                </Tag>
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: F.sans,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: C.muted,
                }}
              >
                {l.desc}
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 508, right: 64, top: 204 }}>
        <Card style={{ padding: "16px 20px", height: 304, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              fontFamily: F.sans,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 900, color: C.ink }}>本次会话召回的记忆</span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: C.muted }}>
              memory_recall · topK 4
            </span>
          </div>

          {ROWS.map((r, i) => {
            const start = 30 + i * 9;
            const hot = i === 0 && frame > 100;
            return (
              <div
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  marginBottom: 5,
                  borderRadius: 9,
                  backgroundColor: hot ? C.accentSoft : "#FAF9F6",
                  border: `1px solid ${hot ? C.accentLine : C.line}`,
                  opacity: interpolate(frame, [start, start + 10], [0, 1], clamp),
                  translate: `${interpolate(frame, [start, start + 10], [-14, 0], clamp)}px 0px`,
                  fontFamily: F.sans,
                  fontSize: 14,
                  color: C.ink2,
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, width: 22 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ flex: 1 }}>{r}</span>
                <Tag color={i === 0 ? C.accent : C.purple} bg={i === 0 ? "#FBEADF" : C.purpleSoft} mono>
                  {i === 0 ? "project" : "global"}
                </Tag>
              </div>
            );
          })}

          {/* 新记忆落库 */}
          <div
            style={{
              marginTop: 2,
              padding: "7px 12px",
              borderRadius: 9,
              border: `2px dashed ${C.accent}`,
              backgroundColor: "#FFFDFB",
              opacity: drop,
              translate: `0px ${interpolate(drop, [0, 1], [-22, 0])}px`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: F.sans,
              fontSize: 14,
              color: C.ink,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 99,
                backgroundColor: C.accent,
                color: "white",
                fontSize: 11,
                display: "grid",
                placeItems: "center",
              }}
            >
              +
            </span>
            <span style={{ flex: 1 }}>新记下：字幕统一用深色胶囊，放在底部居中</span>
            <span style={{ fontFamily: F.mono, fontSize: 11, color: C.accent }}>saved</span>
          </div>
        </Card>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 522,
          display: "flex",
          gap: 12,
          fontFamily: F.sans,
          ...rise(frame, 80, 14, 16),
        }}
      >
        {[
          { t: "作用域决定“在哪想起来”", c: C.ink2 },
          { t: "不是所有记忆都塞进上下文", c: C.ink2 },
          { t: "你说过的偏好，下次自动带上", c: C.accent },
        ].map((x) => (
          <div
            key={x.t}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.74)",
              border: `1px solid ${C.line}`,
              fontSize: 14.5,
              fontWeight: 600,
              color: x.c,
              textAlign: "center",
            }}
          >
            {x.t}
          </div>
        ))}
      </div>

      <CaptionPill text="它不只是记住内容，还知道这条记忆该在什么时候出现" start={86} />
    </SceneFrame>
  );
};