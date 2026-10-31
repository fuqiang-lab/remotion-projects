/**
 * 场景公共约定（放在 index.tsx 之外，避免场景与入口互相 import 成环）。
 */
import type React from "react";

export type NarrationEntry = {
  readonly name: string;
  readonly text: string;
  readonly vo: number;
};

export type SceneProps = {
  /** 该场景对应的口播行（文案 + 实测时长） */
  readonly line: NarrationEntry;
};

/** 与 PPT 的 10 个部分对应；开场/收尾不属于任何章节（null） */
export const CHAPTERS = [
  "LLM 与提示词",
  "上下文与层级",
  "Agent 与 Harness",
  "人格与记忆",
  "三种运行模式",
  "Skills 与 RAG",
  "用好 Agent",
] as const;

/** 每屏口播延迟（秒）：让标题先立住再开口 */
export const VO_DELAY = 0.6;
/** 每屏收尾留白（秒） */
export const TAIL = 0.85;
/** 场景重叠淡化（秒） */
export const OVERLAP_SECONDS = 0.4;

export type SceneComponent = React.FC<SceneProps>;