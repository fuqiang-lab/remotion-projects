import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";

import { Desk } from "../../styles/dark-desk";
import { NARRATION } from "./narration";
import { OVERLAP_SECONDS, TAIL, VO_DELAY, type SceneComponent } from "./scenes-meta";
import { OpeningScene } from "./scenes/01-Opening";
import { RouteScene } from "./scenes/02-Route";
import { PredictorScene } from "./scenes/03-Predictor";
import { HallucinationScene } from "./scenes/04-NotSure";
import { BlindspotScene } from "./scenes/05-Blindspot";
import { BriefScene } from "./scenes/06-Brief";
import { FiveElementScene } from "./scenes/07-FiveElements";
import { StepwiseScene } from "./scenes/08-Stepwise";
import { DeskMemoryScene } from "./scenes/09-ContextDesk";
import { ForgetScene } from "./scenes/10-Forget";
import { LoopScene } from "./scenes/11-Loop";
import { HorseScene } from "./scenes/12-Horse";
import { SoulScene } from "./scenes/13-Soul";
import { MemoryLayersScene } from "./scenes/14-Memory";
import { ModesScene } from "./scenes/15-Modes";
import { SkillsScene } from "./scenes/16-Skills";
import { RagScene } from "./scenes/17-Rag";
import { CheckpointsScene } from "./scenes/18-Checkpoints";
import { BottomLineScene } from "./scenes/19-BottomLine";
import { ClosingScene } from "./scenes/20-Closing";

/**
 * 《AI 提示词设计方法与优化策略》—— 依据研修 PPT（67 页）改编的精讲教学动画。
 *
 * 风格：styles/dark-desk（暗色讲台风，取自 References/动画效果.mp4）
 * 配音：本机 Qwen3-TTS 声音克隆（References/付强声音新录制.m4a）
 * 版式：底板由 Desk 统一提供，场景只做透明度过渡；每屏帧数由实测口播时长反推。
 */

const COMPONENTS: readonly SceneComponent[] = [
  OpeningScene,
  RouteScene,
  PredictorScene,
  HallucinationScene,
  BlindspotScene,
  BriefScene,
  FiveElementScene,
  StepwiseScene,
  DeskMemoryScene,
  ForgetScene,
  LoopScene,
  HorseScene,
  SoulScene,
  MemoryLayersScene,
  ModesScene,
  SkillsScene,
  RagScene,
  CheckpointsScene,
  BottomLineScene,
  ClosingScene,
];

if (COMPONENTS.length !== NARRATION.length) {
  throw new Error(`场景组件 ${COMPONENTS.length} 个，与口播稿 ${NARRATION.length} 句不一致`);
}

/** 口播未回填时的占位时长（每屏 8 秒），只为让 Studio 能预览版式 */
const PLACEHOLDER_VO = 8;
const isPlaceholder = NARRATION.some((n) => n.vo <= 0);
if (isPlaceholder) {
  console.warn("[prompt-design] 口播时长未回填，当前使用占位时长预览画面");
}

const voSeconds = (line: { readonly vo: number }) => (line.vo > 0 ? line.vo : PLACEHOLDER_VO);

/** 每屏帧数 = 口播秒数 × fps + 0.6s 入 + 0.85s 出 */
const sceneFrames = (vo: number, fps: number) => Math.round((vo + VO_DELAY + TAIL) * fps);

export const PromptDesign: React.FC = () => {
  const { fps } = useVideoConfig();
  const lengths = NARRATION.map((n) => sceneFrames(voSeconds(n), fps));
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  const overlap = Math.round(OVERLAP_SECONDS * fps);
  const voDelay = Math.round(VO_DELAY * fps);
  const total = lengths.reduce((a, b) => a + b, 0);

  return (
    <Desk>
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
              <Scene line={line} />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {isPlaceholder ? null : (
        <Sequence name="口播" durationInFrames={total}>
          {NARRATION.map((line, i) => (
            <Sequence
              key={`vo-${line.name}`}
              from={starts[i] + voDelay}
              durationInFrames={lengths[i]}
            >
              <Audio
                src={staticFile(`prompt-design/vo/${String(i).padStart(2, "0")}.mp3`)}
                volume={1}
              />
            </Sequence>
          ))}
        </Sequence>
      )}
    </Desk>
  );
};

/** 供 Root 注册用的总帧数 */
export const promptDesignFrames = (fps: number) =>
  NARRATION.reduce((sum, n) => sum + sceneFrames(voSeconds(n), fps), 0);

/** 每屏起始帧（秒），用于核对口播节奏 */
export const sceneCues = (fps: number) => {
  let acc = 0;
  return NARRATION.map((n) => {
    const cue = acc / fps;
    acc += sceneFrames(voSeconds(n), fps);
    return cue;
  });
};