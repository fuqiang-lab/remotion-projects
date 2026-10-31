import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, rise } from "../theme";
import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, Tag } from "../ui";

/** 08 安全：沙箱与审批 */
export const SandboxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const okPop = spring({ frame: frame - 92, fps, config: { damping: 13, mass: 0.6 } });

  return (
    <SceneFrame padBottom={124}>
      <Nav chapter={4} />
      <SceneTitle
        label="SAFE · 安全"
        title="它能动手，但手在笼子里"
        accent="手在笼子里"
      />

      {/* 沙箱：一个带栅格的圆角容器 */}
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 226,
          width: 520,
          height: 300,
          borderRadius: 20,
          border: `2px solid ${C.ink}`,
          background:
            "repeating-linear-gradient(45deg, #F1EFEA 0 12px, #FBFAF7 12px 24px)",
          padding: 18,
          ...rise(frame, 14, 30, 18),
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -13,
            left: 22,
            padding: "3px 12px",
            borderRadius: 999,
            backgroundColor: C.ink,
            color: "#F6F5F2",
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          SANDBOX · 工作区
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: "100%" }}>
          <Card style={{ padding: 16, ...rise(frame, 30, 16, 16) }}>
            <Tag color={C.green} bg={C.greenSoft} mono>
              allowed
            </Tag>
            <div style={{ fontFamily: F.mono, fontSize: 12.5, marginTop: 10, color: C.ink2, lineHeight: 1.9 }}>
              src/<br />
              effects/<br />
              tmp/ （临时目录）
            </div>
          </Card>
          <Card
            style={{
              padding: 16,
              borderColor: C.line,
              ...rise(frame, 40, 16, 16),
              opacity: 0.6,
            }}
          >
            <Tag color={C.muted} bg="#F1EFEA" mono>
              reading only
            </Tag>
            <div style={{ fontFamily: F.mono, fontSize: 12.5, marginTop: 10, color: C.muted, lineHeight: 1.9 }}>
              C:\Program Files\<br />
              ~/.ssh/<br />
              D:\ .. （其他盘）
            </div>
          </Card>
        </div>
      </div>

      {/* 审批流 */}
      <div style={{ position: "absolute", left: 668, right: 64, top: 226 }}>
        <Card style={{ padding: 22, ...rise(frame, 24, 26, 18) }}>
          <div style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 900, color: C.ink, marginBottom: 14 }}>
            越过边界的操作，会先来问你
          </div>

          <div
            style={{
              borderRadius: 10,
              backgroundColor: "#23262D",
              padding: "14px 16px",
              fontFamily: F.mono,
              fontSize: 13,
              color: "#E8E6E1",
              lineHeight: 1.7,
              ...rise(frame, 36, 14, 16),
            }}
          >
            <div style={{ color: "#F0A882" }}>▸ 需要你的批准</div>
            <div>写入 · D:\Backup\report.xlsx</div>
            <div style={{ opacity: 0.55 }}>原因：目标不在当前工作区内</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {[
              { k: "允许一次", c: C.ink, bg: "#F1EFEA", pop: 0 },
              { k: "本会话允许", c: C.blue, bg: C.blueSoft, pop: 0 },
              { k: "拒绝", c: C.muted, bg: "#F1EFEA", pop: 0 },
            ].map((b, i) => (
              <div
                key={b.k}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "9px 0",
                  borderRadius: 8,
                  backgroundColor: b.bg,
                  color: b.c,
                  fontFamily: F.sans,
                  fontSize: 14,
                  fontWeight: 700,
                  border: `1px solid ${i === 0 && frame > 84 ? C.ink : "transparent"}`,
                  opacity: Math.min(1, Math.max(0, (frame - 48) / 10)),
                  scale: String(i === 0 ? 0.98 + okPop * 0.04 : 1),
                }}
              >
                {b.k}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: F.sans,
              fontSize: 14,
              color: C.green,
              opacity: Math.min(1, Math.max(0, (frame - 96) / 12)),
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 99,
                backgroundColor: C.green,
                color: "white",
                fontSize: 11,
                display: "grid",
                placeItems: "center",
              }}
            >
              ✓
            </span>
            你点了“允许”，它才继续执行
          </div>
        </Card>
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          right: 64,
          top: 552,
          display: "flex",
          gap: 12,
          ...rise(frame, 64, 14, 16),
        }}
      >
        {[
          "文件读写有边界",
          "命令执行有边界",
          "每个动作都留痕",
        ].map((t) => (
          <div
            key={t}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: `1px solid ${C.line}`,
              backgroundColor: "rgba(255,255,255,0.8)",
              fontFamily: F.sans,
              fontSize: 14,
              fontWeight: 600,
              color: C.ink2,
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <CaptionPill text="能力越大，边界越要清楚——沙箱和审批是它的缰绳" start={44} />
    </SceneFrame>
  );
};