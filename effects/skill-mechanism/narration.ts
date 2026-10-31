/**
 * 《Skill 的机制与安装》口播稿 —— 全片唯一事实来源。
 *
 * 内容依据：SK01-Skill机制与安装.pptx（14 页）逐页整理改写，不增删原著结论。
 * 顺序与 index.tsx 中的 SCENES 一一对应；场景帧数由对应音频的实际时长反推。
 *
 * 音频：public/skill-mechanism/vo/NN.mp3（本机 Qwen3-TTS，付强音色克隆）
 */
export type NarrationLine = {
  /** 场景名（同时作为 Sequence 的 name） */
  readonly name: string;
  /** 口播原句（= 字幕胶囊文案） */
  readonly text: string;
  /** 该句音频实测时长（秒），来自 public/skill-mechanism/vo/NN.mp3 */
  readonly vo: number;
};

export const NARRATION: readonly NarrationLine[] = [
  {
    name: "开场",
    text: "今天用十分钟，把 Skill 讲清楚：它是什么，怎么加载，装在哪里。",
    vo: 6.88,
  },
  {
    name: "本讲路线",
    text: "四件事：是什么，怎么加载，装在哪，怎么自查。今天不展开怎么写 Skill。",
    vo: 8.32,
  },
  {
    name: "什么是 Skill",
    text: "一句话说，Skill 就是把你的一套做法，固化成一个可插拔、能复用的能力包。",
    vo: 7.92,
  },
  {
    name: "一个 Skill 里装了什么",
    text: "它里面很朴素：一个 SKILL.md 必填，外加几个按需取用的文件夹。",
    vo: 9.36,
  },
  {
    name: "为什么不能一次全读进来",
    text: "为什么不一次全读进来？上下文会满，成本会涨，注意力还会被稀释。",
    vo: 6.56,
  },
  {
    name: "三级渐进加载",
    text: "解法是三级渐进加载：目录常驻，正文按需，资源再按需。",
    vo: 6.64,
  },
  {
    name: "三个容易踩的坑",
    text: "诀窍只有一条：第一层的描述，一定要写到模型一眼就能判断该不该用。",
    vo: 7.36,
  },
  {
    name: "装在哪儿",
    text: "装在哪？全局装用户目录，一处装到处能用；项目装项目目录，跟着文件夹走。",
    vo: 9.2,
  },
  {
    name: "安装目录",
    text: "记一个位置就够：先找点 agents 下面的 skills。",
    vo: 6.16,
  },
  {
    name: "目录结构",
    text: "目录结构只有两层：技能目录，里面直接放 SKILL.md，多套一层就找不到。",
    vo: 8.48,
  },
  {
    name: "安装三步",
    text: "安装三步：选位置，复制文件夹，刷新确认生效。",
    vo: 6.16,
  },
  {
    name: "装完自查",
    text: "装完自查三件事：目录在不在，SKILL.md 在不在，技能清单里有没有它。",
    vo: 9.36,
  },
  {
    name: "三句话记住",
    text: "记住三句话：能力包、三级渐进、先找点 agents 下面的 skills。",
    vo: 7.04,
  },
  {
    name: "课后三件事",
    text: "课后还有三件事：装一个，自检一次，再把自己的做法写成一个 SKILL.md。",
    vo: 9.68,
  },
  {
    name: "收尾",
    text: "以上就是 Skill 的机制与安装，谢谢，有问题随时找我。",
    vo: 6.16,
  },
];