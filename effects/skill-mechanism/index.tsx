import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { NARRATION } from "./narration";
import { OVERLAP_SECONDS, TAIL, VO_DELAY, type SceneComponent } from "./scenes-meta";
import { Paper } from "./ui";
import { OpeningScene } from "./scenes/01-Opening";
import { RouteScene } from "./scenes/02-Route";
import { WhatScene } from "./scenes/03-What";
import { AnatomyScene } from "./scenes/04-Anatomy";
import { CostScene } from "./scenes/05-Cost";
import { LoadingScene } from "./scenes/06-Loading";
import { PitfallScene } from "./scenes/07-Pitfalls";
import { WhereScene } from "./scenes/08-Where";
import { DirsScene } from "./scenes/09-Dirs";
import { LayoutScene } from "./scenes/10-Layout";
import { ThreeStepsScene } from "./scenes/11-ThreeSteps";
import { CheckScene } from "./scenes/12-Check";
import { RecapScene } from "./scenes/13-Recap";
import { HomeworkScene } from "./scenes/14-Homework";
import { ClosingScene } from "./scenes/15-Closing";

/**
 * 《Skill 的机制与安装》—— 依据 SK01-Skill机制与安装.pptx 改编的解说短片。
 *
 * 版式沿用 styles/editorial-light（米白编辑风）：
 * 底板由 Paper 统一提供，场景只做透明度过渡；场景帧数由口播实测时长反推。
 */

/** 场景组件，顺序与 narration.ts 一一对应 */
const COMPONENTS: readonly SceneComponent[] = [
  OpeningScene,
  RouteScene,
  WhatScene,
  AnatomyScene,
  CostScene,
  LoadingScene,
  PitfallScene,
  WhereScene,
  DirsScene,
  LayoutScene,
  ThreeStepsScene,
  CheckScene,
  RecapScene,
  HomeworkScene,
  ClosingScene,
];

if (COMPONENTS.length !== NARRATION.length) {
  throw new Error(
    `场景组件 ${COMPONENTS.length} 个，与口播稿 ${NARRATION.length} 句不一致`,
  );
}

/**
 * 配音未全部就绪时用一个占位时长（每屏 8 秒）让 Studio 仍可预览画面版式；
 * 生成完音频后把实测秒数回填进 narration.ts，这个兜底就不会再被用到。
 */
const PLACEHOLDER_VO = 8;
const isPlaceholder = NARRATION.some((n) => n.vo <= 0);
if (isPlaceholder) {
  console.warn("[skill-mechanism] 口播时长未回填，当前使用占位时长预览画面");
}

const voSeconds = (line: { readonly vo: number }) =>
  line.vo > 0 ? line.vo : PLACEHOLDER_VO;

/** 每屏帧数 = 口播秒数 × fps + 0.6s 入 + 0.85s 出 */
const sceneFrames = (vo: number, fps: number) =>
  Math.round((vo + VO_DELAY + TAIL) * fps);

/** 每屏起始帧（不含重叠） */
const makeStarts = (lengths: readonly number[]) =>
  lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));

export const SceneTimeline: React.FC = () => {
  const { fps } = useVideoConfig();
  const lengths = NARRATION.map((n) => sceneFrames(voSeconds(n), fps));
  const starts = makeStarts(lengths);
  const overlap = Math.round(OVERLAP_SECONDS * fps);
  const voDelay = Math.round(VO_DELAY * fps);
  const total = lengths.reduce((a, b) => a + b, 0);

  return (
    <Paper>
      {NARRATION.map((line, i) => {
        const Scene = COMPONENTS[i];
        const isLast = i === NARRATION.length - 1;
        return (
          <Sequence
            key={line.name}
            name={line.name}
            from={starts[i]}
            durationInFrames={lengths[i] + (isLast ? 0 : overlap)}
          >
            <AbsoluteFill>
              <Scene
                line={line}
                nav={{ page: i + 1, total: NARRATION.length }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <Sequence name="口播" durationInFrames={total}>
        {isPlaceholder
          ? null
          : NARRATION.map((line, i) => (
              <Sequence
                key={`vo-${line.name}`}
                from={starts[i] + voDelay}
                durationInFrames={lengths[i]}
              >
                <Audio
                  src={staticFile(`skill-mechanism/vo/${String(i).padStart(2, "0")}.mp3`)}
                  volume={1}
                />
              </Sequence>
            ))}
      </Sequence>
    </Paper>
  );
};

/** 供 Root 注册用的总帧数 */
export const skillMechanismFrames = (fps: number) =>
  NARRATION.reduce((sum, n) => sum + sceneFrames(voSeconds(n), fps), 0);

export const SkillMechanism: React.FC = () => <SceneTimeline />;