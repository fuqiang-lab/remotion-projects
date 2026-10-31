import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { DshIntro, TOTAL_FRAMES } from "../effects/dsh-intro";
import { SkillMechanism, skillMechanismFrames } from "../effects/skill-mechanism";
import { PromptDesign, promptDesignFrames } from "../effects/prompt-design";
import { SmokeTest, SMOKE_TEST_DURATION } from "../effects/smoke-test";
import { DarkDeskShowcase } from "../styles/dark-desk/showcase";
import {
  EditorialLightShowcase,
  SHOWCASE_DURATION,
} from "../styles/editorial-light/showcase";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      {/* 冒烟测试：不依赖任何外部素材，新机器部署完先渲染它验证链路 */}
      <Composition
        id="SmokeTest"
        component={SmokeTest}
        durationInFrames={SMOKE_TEST_DURATION}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="DshIntro"
        component={DshIntro}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
      {/* Skill 的机制与安装：依据 SK01-Skill机制与安装.pptx 改编，Editorial Light 风格 */}
      <Composition
        id="SkillMechanism"
        component={SkillMechanism}
        durationInFrames={skillMechanismFrames(FPS)}
        fps={FPS}
        width={1280}
        height={720}
      />
      {/* 《AI 提示词设计方法与优化策略》精讲：依据研修 PPT（67 页）改编，Dark Desk 风格 */}
      <Composition
        id="PromptDesign"
        component={PromptDesign}
        durationInFrames={promptDesignFrames(FPS)}
        fps={FPS}
        width={1280}
        height={720}
      />
      {/* 风格库样本：仅用于核对版式，正式作品请复制 styles/ 的组件自行组装 */}
      <Composition
        id="EditorialLightShowcase"
        component={EditorialLightShowcase}
        durationInFrames={SHOWCASE_DURATION}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="DarkDeskShowcase"
        component={DarkDeskShowcase}
        durationInFrames={90}
        fps={FPS}
        width={1280}
        height={720}
      />
    </>
  );
};