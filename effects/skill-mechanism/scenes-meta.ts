/**
 * 场景公共类型与常量。
 * 放在 index.tsx 之外，避免场景文件与 index.tsx 互相 import 形成循环引用。
 */
import type React from "react";

export type NarrationEntry = {
  readonly name: string;
  readonly text: string;
  readonly vo: number;
};

/** 传给每个场景的导航信息（页码与总数由 SCENES.length 推导，不写死） */
export type NavSeed = {
  readonly page: number;
  readonly total: number;
};

export type SceneProps = {
  /** 该场景对应的口播行（含文案与实测时长） */
  readonly line: NarrationEntry;
  readonly nav: NavSeed;
};

/** 四个章节名，供顶部导航使用；null 表示开场/收尾这类非章节页 */
export const CHAPTERS = ["是什么", "怎么加载", "装在哪", "怎么自查"] as const;

/** 每屏的口播起始延迟（秒）：先让标题入场再开口 */
export const VO_DELAY = 0.6;
/** 每屏收尾留白（秒） */
export const TAIL = 0.85;
/** 场景之间的重叠淡化帧数（0.4 s） */
export const OVERLAP_SECONDS = 0.4;

export type SceneComponent = React.FC<SceneProps>;