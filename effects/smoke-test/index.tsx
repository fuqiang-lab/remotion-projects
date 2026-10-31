import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * 部署冒烟测试 / 第一个测试教学动画
 *
 * 目的：**不依赖任何外部素材**（无图片、无音频、无 staticFile），
 * 只用 Remotion 内置能力，验证「打包 → 无头浏览器出帧 → 编码成 MP4」整条链路。
 *
 * 用法：新机器部署完成后第一时间渲染它。
 *   npx remotion still SmokeTest out/smoke.png --frame=40
 *   npx remotion render SmokeTest out/smoke.mp4
 *
 * 它故意不 import 任何 styles/ 或 effects/ 里的东西，
 * 方便整个文件复制到任意新工程做最小验证。
 */

const C = {
  bg: "#F4F3F8",
  card: "#FFFFFF",
  ink: "#22252D",
  muted: "#8C8FA0",
  accent: "#E06C3C",
  line: "#E2E0E7",
};

/** 首尾淡化帧数，避免场景硬切 */
const FADE = 10;
const FPS = 30;

const OPENING = 2.5 * FPS; // 75
const POINTS_DUR = 4 * FPS; // 120
const CLOSING = 2.5 * FPS; // 75

/** 供 src/Root.tsx 注册时使用 */
export const SMOKE_TEST_DURATION = OPENING + POINTS_DUR + CLOSING; // 270 帧 = 9 秒

const SceneShell: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE, duration - FADE, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{ opacity, justifyContent: "center", alignItems: "center" }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Opening: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [40, 0]);

  return (
    <SceneShell duration={duration}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 10,
            color: C.accent,
          }}
        >
          部署验证
        </div>
        <div
          style={{
            fontSize: 86,
            fontWeight: 800,
            color: C.ink,
            marginTop: 18,
            transform: `translateY(${y}px)`,
          }}
        >
          测试教学动画
        </div>
        <div style={{ fontSize: 28, color: C.muted, marginTop: 24 }}>
          这一屏能播放，说明渲染链路已经通了
        </div>
      </div>
    </SceneShell>
  );
};

const BULLETS = [
  { n: "01", t: "打包成功", d: "Rspack 编译通过，无类型错误" },
  { n: "02", t: "出帧正常", d: "无头浏览器逐帧渲染无报错" },
  { n: "03", t: "编码完成", d: "合成 MP4，时长与帧率一致" },
] as const;

const Points: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell duration={duration}>
      <div style={{ width: 900 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: C.ink,
            marginBottom: 30,
          }}
        >
          这条链路要验证三件事
        </div>

        {BULLETS.map((p, i) => {
          const s = spring({
            frame: Math.max(0, frame - 10 - i * 12),
            fps,
            config: { damping: 200 },
          });
          const x = interpolate(s, [0, 1], [-28, 0]);

          return (
            <div
              key={p.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 18,
                padding: "20px 28px",
                marginBottom: 14,
                opacity: s,
                transform: `translateX(${x}px)`,
              }}
            >
              <span
                style={{ fontSize: 24, fontWeight: 800, color: C.accent }}
              >
                {p.n}
              </span>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>
                  {p.t}
                </div>
                <div style={{ fontSize: 19, color: C.muted, marginTop: 4 }}>
                  {p.d}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const Closing: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const scale = interpolate(s, [0, 1], [0.6, 1]);

  return (
    <SceneShell duration={duration}>
      <div
        style={{
          textAlign: "center",
          opacity: Math.min(1, s),
          transform: `scale(${scale})`,
        }}
      >
        {/* 用 SVG 画对勾，避免依赖系统 emoji 字体（无头浏览器常缺字体，会渲染成方框） */}
        <svg width={108} height={108} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={C.accent}
            strokeWidth="5"
          />
          <path
            d="M28 52 L44 68 L73 35"
            fill="none"
            stroke={C.accent}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: C.ink,
            marginTop: 10,
          }}
        >
          部署成功
        </div>
        <div style={{ fontSize: 24, color: C.muted, marginTop: 14 }}>
          可以开始做正式作品了
        </div>
      </div>
    </SceneShell>
  );
};

/**
 * 冒烟测试主组件：三屏串联，共 9 秒。
 * 只依赖 Remotion 内置能力，不读任何外部素材。
 */
export const SmokeTest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence durationInFrames={OPENING}>
        <Opening duration={OPENING} />
      </Sequence>
      <Sequence from={OPENING} durationInFrames={POINTS_DUR}>
        <Points duration={POINTS_DUR} />
      </Sequence>
      <Sequence from={OPENING + POINTS_DUR} durationInFrames={CLOSING}>
        <Closing duration={CLOSING} />
      </Sequence>
    </AbsoluteFill>
  );
};
