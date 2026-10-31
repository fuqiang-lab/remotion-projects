import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import type React from "react";
import { Paper } from "./ui";
import { NARRATION } from "./narration";
import { ClosingScene } from "./scenes/ClosingScene";
import { LoopScene } from "./scenes/LoopScene";
import { MemoryScene } from "./scenes/MemoryScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { OutlineScene } from "./scenes/OutlineScene";
import { QuickStartScene } from "./scenes/QuickStartScene";
import { SandboxScene } from "./scenes/SandboxScene";
import { SkillsScene } from "./scenes/SkillsScene";
import { SummaryScene } from "./scenes/SummaryScene";
import { WhatScene } from "./scenes/WhatScene";
import { WorkflowScene } from "./scenes/WorkflowScene";

/**
 * 每个场景的帧数 = 口播时长 + 留白，保证画面跟着配音走。
 * 若重新生成口播，改这里的 vo 秒数即可。
 */
export const SCENES = [
  { name: "开场", vo: 8.32 },
  { name: "导览", vo: 9.84 },
  { name: "它是什么", vo: 8.72 },
  { name: "核心能力", vo: 10.96 },
  { name: "五步上手", vo: 7.2 },
  { name: "技能系统", vo: 6.08 },
  { name: "记忆", vo: 6.16 },
  { name: "安全边界", vo: 6.0 },
  { name: "协作与收尾", vo: 6.96 },
  { name: "回顾", vo: 5.6 },
  { name: "收尾", vo: 6.48 },
] as const;

/** 画面比口播多留的秒数：开头等标题入场，结尾留呼吸 */
const LEAD_IN = 0.6;
const TAIL = 0.85;

const FPS = 30;

const sceneFrames = (vo: number) => Math.round((vo + LEAD_IN + TAIL) * FPS);

/** 全片总帧数，供 Root 注册 Composition 时使用 */
export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + sceneFrames(s.vo), 0);

type SceneEntry = { readonly Component: React.FC };

if (NARRATION.length !== SCENES.length) {
  throw new Error(
    `口播稿 ${NARRATION.length} 句与场景 ${SCENES.length} 个数量不一致`,
  );
}

const LIST: SceneEntry[] = [
  { Component: OpeningScene },
  { Component: OutlineScene },
  { Component: WhatScene },
  { Component: LoopScene },
  { Component: QuickStartScene },
  { Component: SkillsScene },
  { Component: MemoryScene },
  { Component: SandboxScene },
  { Component: WorkflowScene },
  { Component: SummaryScene },
  { Component: ClosingScene },
];

/** 认识 DeepSeek Harness 的介绍短片 */
export const DshIntro: React.FC = () => {
  const { fps } = useVideoConfig();

  const lengths = SCENES.map((s) => sceneFrames(s.vo));
  const start = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  const OVERLAP = Math.round(0.4 * fps);
  /** 口播比画面稍晚进入，让标题先立住 */
  const VO_DELAY = Math.round(LEAD_IN * fps);

  return (
    <Paper>
      {SCENES.map((scene, i) => {
        const { Component } = LIST[i];
        const isLast = i === SCENES.length - 1;
        return (
          <Sequence
            key={scene.name}
            name={scene.name}
            from={start[i]}
            durationInFrames={lengths[i] + (isLast ? 0 : OVERLAP)}
          >
            <AbsoluteFill>
              <Component />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <Sequence name="口播" durationInFrames={lengths.reduce((a, b) => a + b, 0)}>
        {SCENES.map((scene, i) => (
          <Sequence
            key={`vo-${scene.name}`}
            from={start[i] + VO_DELAY}
            durationInFrames={lengths[i]}
          >
            <Audio
              src={staticFile(`dsh-intro/vo/${String(i).padStart(2, "0")}.mp3`)}
              volume={1}
            />
          </Sequence>
        ))}
      </Sequence>
    </Paper>
  );
};