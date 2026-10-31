import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, L, rise } from "./theme";
import { CaptionPill, Nav, Paper, SceneFrame } from "./ui";
import { CompareScene } from "./showcase-scenes/CompareScene";
import { FlowScene } from "./showcase-scenes/FlowScene";
import { GridScene } from "./showcase-scenes/GridScene";

/** 开场：居中标题页（版式 1） */
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <SceneFrame padBottom={L.captionBand}>
      <Nav label="开场" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -40 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 18px)",
            gap: 8,
            marginBottom: 30,
            scale: String(mark),
          }}
        >
          {[C.ink, C.accent, C.ink, C.line].map((bg, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: bg }} />
          ))}
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 86,
            fontWeight: 900,
            letterSpacing: -2.4,
            color: C.ink,
            whiteSpace: "nowrap",
            ...rise(frame, 8, 24, 20),
          }}
        >
          Editorial <span style={{ color: C.accent }}>Light</span>
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: 5,
            color: C.muted,
            ...rise(frame, 20, 12, 16),
          }}
        >
          米白编辑风 · 风格样本
        </div>
      </AbsoluteFill>
      <CaptionPill text="六个版式，一套令牌，照着填内容就行" start={40} />
    </SceneFrame>
  );
};

/** 收尾：把六种版式收成一行 */
const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const kinds = ["居中标题页", "卡片网格页", "左文右图页", "对比页", "流程页", "列表 + 详情页"];

  return (
    <SceneFrame padBottom={L.captionBand}>
      <Nav label="收尾" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -40 }}>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 5,
            color: C.muted,
            marginBottom: 18,
            ...rise(frame, 6, 10, 14),
          }}
        >
          六种版式
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            fontFamily: F.sans,
            ...rise(frame, 14, 18, 18),
          }}
        >
          {kinds.map((k, i) => (
            <span
              key={k}
              style={{
                padding: "9px 16px",
                borderRadius: 999,
                border: `1px solid ${C.line}`,
                backgroundColor: i === 0 ? C.accentSoft : "#FFFFFF",
                color: i === 0 ? C.accent : C.ink2,
                fontSize: 15,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {k}
            </span>
          ))}
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: F.sans,
            fontSize: 16,
            color: C.muted,
            ...rise(frame, 40, 12, 16),
          }}
        >
          规范见 <span style={{ fontFamily: F.mono, color: C.ink }}>styles/editorial-light/README.md</span>
        </div>
      </AbsoluteFill>
      <CaptionPill text="选一个版式，把内容填进默认结构即可" start={30} />
    </SceneFrame>
  );
};

const FRAMES = [180, 210, 210, 180];
/** 前三个场景之间各留 12 帧重叠淡化 */
const OVERLAP = 12;
const RECAP = 150;

const STARTS = [
  0,
  FRAMES[0],
  FRAMES[0] + FRAMES[1],
  FRAMES[0] + FRAMES[1] + FRAMES[2],
  FRAMES[0] + FRAMES[1] + FRAMES[2] + FRAMES[3],
];

/** 风格样本：四种版式的可运行案例，用于在 Studio 里核对风格 */
export const EditorialLightShowcase: React.FC = () => {
  return (
    <Paper>
      <Sequence name="居中标题页" durationInFrames={FRAMES[0]}>
        <TitleScene />
      </Sequence>
      <Sequence name="卡片网格页" from={STARTS[1]} durationInFrames={FRAMES[1] + OVERLAP}>
        <GridScene />
      </Sequence>
      <Sequence name="对比页" from={STARTS[2]} durationInFrames={FRAMES[2] + OVERLAP}>
        <CompareScene />
      </Sequence>
      <Sequence name="流程页" from={STARTS[3]} durationInFrames={FRAMES[3] + OVERLAP}>
        <FlowScene />
      </Sequence>
      <Sequence name="收尾" from={STARTS[4]} durationInFrames={RECAP}>
        <RecapScene />
      </Sequence>
    </Paper>
  );
};

export const SHOWCASE_DURATION = STARTS[4] + RECAP;