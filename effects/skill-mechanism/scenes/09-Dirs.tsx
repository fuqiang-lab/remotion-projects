import { useCurrentFrame } from "remotion";

import { CaptionPill, Card, Nav, SceneFrame, SceneTitle, StepNo, Tag } from "../ui";
import type { SceneProps } from "../scenes-meta";
import { C, F } from "../theme";
import { rise } from "../theme-helpers";

const PATHS = [
  {
    os: "全局 · Windows",
    path: "C:\\Users\\<用户名>\\.agents\\skills\\",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    os: "全局 · macOS / Linux",
    path: "~/.agents/skills/",
    color: C.accent,
    bg: C.accentSoft,
    line: C.accentLine,
  },
  {
    os: "项目级（两种系统都一样）",
    path: "<项目文件夹>\\.agents\\skills\\",
    color: C.blue,
    bg: C.blueSoft,
    line: C.blueLine,
  },
];

/** 09 安装目录：一个锚点 + 三条典型路径 */
export const DirsScene: React.FC<SceneProps> = ({ line, nav }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame>
      <Nav chapter={2} label="装在哪" page={nav.page} total={nav.total} />
      <SceneTitle
        label="PATH · 安装目录"
        title="记不住就记一条：先找 .agents\\skills"
        accent=".agents\\skills"
      />

      <div style={{ position: "absolute", left: 64, top: 214, width: 560 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: 3,
            color: C.muted,
            marginBottom: 12,
            ...rise(frame, 18, 10, 14),
          }}
        >
          主要的安装目录（通用口径）
        </div>
        {PATHS.map((p, i) => (
          <Card
            key={p.os}
            style={{
              padding: "13px 18px",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 16,
              ...rise(frame, 26 + i * 9, 16, 16),
            }}
          >
            <span
              style={{
                width: 8,
                height: 34,
                borderRadius: 4,
                backgroundColor: p.color,
                flexShrink: 0,
                opacity: 0.85,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.sans, fontSize: 13.5, fontWeight: 800, color: C.muted }}>
                {p.os}
              </div>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: F.mono,
                  fontSize: 15.5,
                  fontWeight: 500,
                  color: C.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {p.path}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ position: "absolute", left: 664, right: 64, top: 214 }}>
        <Card
          style={{
            padding: "24px 26px",
            backgroundColor: "#FFFFFF",
            border: `1px solid ${C.accentLine}`,
            ...rise(frame, 22, 20, 18),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StepNo n="锚" size={28} color={C.accent} bg={C.accentSoft} />
            <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: C.accent }}>
              只需要记住这一句
            </span>
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: F.mono,
              fontSize: 30,
              fontWeight: 500,
              color: C.ink,
              letterSpacing: -0.5,
              lineHeight: 1.3,
            }}
          >
            .agents<span style={{ color: C.accent }}>\\skills</span>
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: F.sans,
              fontSize: 15,
              lineHeight: 1.6,
              color: C.ink2,
            }}
          >
            「点 agents，下面建一个 skills」——
            <span style={{ color: C.muted }}>全局和项目级，路径的后半段是一样的。</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Tag color={C.accent} bg={C.accentSoft}>
              全局 = 用户目录
            </Tag>
            <Tag color={C.blue} bg={C.blueSoft}>
              项目 = 项目文件夹
            </Tag>
          </div>
        </Card>

        <div
          style={{
            marginTop: 16,
            padding: "13px 16px",
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.7)",
            border: `1px dashed ${C.line}`,
            fontFamily: F.sans,
            fontSize: 13.5,
            lineHeight: 1.6,
            color: C.muted,
            ...rise(frame, 62, 12, 16),
          }}
        >
          以你所用产品的实际扫描路径为准；多数工具
          <span style={{ color: C.ink, fontWeight: 700 }}>同时扫描用户级与项目级</span>
          。上表为通用口径示例。
        </div>
      </div>

      <CaptionPill text={line.text} start={40} width={760} />
    </SceneFrame>
  );
};