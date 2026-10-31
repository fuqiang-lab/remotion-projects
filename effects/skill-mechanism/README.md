# 《Skill 的机制与安装》解说视频 · 制作说明

> 成片：`out/Skill机制与安装-解说.mp4`（1280×720 / 30fps / 约 2 分 17 秒）
> 预览：`npm run dev` → `http://localhost:3000/SkillMechanism`（Studio 里可直接拖动时间轴、改字幕）
> 画面风格：`styles/editorial-light`（米白编辑风）；声音：本机 Qwen3-TTS，付强参考音色克隆。

---

## 1. 内容依据（逐屏对照原 PPT）

内容全部来自 `SK01-Skill机制与安装.pptx`（14 页），**未增删原稿结论**，只做口语化改写与版式重组。

| 屏 | 标题 | 对应原页 | 口播（即底部字幕） |
| --- | --- | --- | --- |
| 01 | Skill 的机制与安装 | P1 封面 | 今天用十分钟，把 Skill 讲清楚：它是什么，怎么加载，装在哪里。 |
| 02 | 今天只讲清楚四件事 | P2 路线 | 四件事：是什么，怎么加载，装在哪，怎么自查。今天不展开怎么写 Skill。 |
| 03 | Skill：把一套做法固化下来 | P3 定义 | 一句话说，Skill 就是把你的一套做法，固化成一个可插拔、能复用的能力包。 |
| 04 | Skill 里装了什么 | P4 结构 | 它里面很朴素：一个 SKILL.md 必填，外加几个按需取用的文件夹。 |
| 05 | 为什么不能一次全读进来 | P5 动机 | 为什么不一次全读进来？上下文会满，成本会涨，注意力还会被稀释。 |
| 06 | 三级渐进加载，按需打开 | P6 渐进 | 解法是三级渐进加载：目录常驻，正文按需，资源再按需。 |
| 07 | 三个容易踩的坑 | P7 坑 | 诀窍只有一条：第一层的描述，一定要写到模型一眼就能判断该不该用。 |
| 08 | 两个位置，两种作用域 | P8 作用域 | 装在哪？全局装用户目录，一处装到处能用；项目装项目目录，跟着文件夹走。 |
| 09 | 记不住就记一条：先找 .agents\skills | P9 目录 | 记一个位置就够：先找点 agents 下面的 skills。 |
| 10 | 正好两层，多一层就找不到 | P10 结构 | 目录结构只有两层：技能目录，里面直接放 SKILL.md，多套一层就找不到。 |
| 11 | 三步：选位置 → 复制 → 刷新 | P11 安装三步 | 安装三步：选位置，复制文件夹，刷新确认生效。 |
| 12 | 装完自查：三层确认 | P12 自查 | 装完自查三件事：目录在不在，SKILL.md 在不在，技能清单里有没有它。 |
| 13 | 记住三句话就够了 | P13 小结 | 记住三句话：能力包、三级渐进、先找点 agents 下面的 skills。 |
| 14 | 课后可做的三件事 | P14 课后 | 课后还有三件事：装一个，自检一次，再把自己的做法写成一个 SKILL.md。 |
| 15 | 谢谢，有问题随时找我 | —（收尾） | 以上就是 Skill 的机制与安装，谢谢，有问题随时找我。 |

**改写口径说明**

- P7 原页只有「三个坑」，没有给改法；卡片上的「改法」一列是从 P6 的三级加载道理直接推出来的对应做法，没有引入原稿之外的新论断。
- P9 原页给出的是通用口径目录；片中列了三条例示路径，并在画面右下角明确标注「以所用产品实际扫描路径为准」。
- P10 沿用原页对「多套一层 / 少一层」的解释，并保留「DeepSeek Harness 官方文档：发现深度为一层」的出处标注。
- 「20 个 Skill、每个 3000 字」是原页给出的**举例假设**，片中也保持为假设口径，未被当作实测数据。

---

## 2. 文件结构

```
effects/skill-mechanism/
├─ index.tsx          场景编排 + 音频对齐（场景帧数由口播时长反推）
├─ narration.ts       口播稿单一事实来源（文案 + 实测秒数 vo）
├─ scenes-meta.ts     场景公共类型、章节名、入/出时长常量
├─ theme.ts           色值 / 字体（与 styles/editorial-light/theme.ts 同步）
├─ theme-helpers.ts   rise / progress / stagger（依赖 remotion 运行时，单独成文件）
├─ ui.tsx             Paper / Nav / SceneTitle / CaptionPill / Card / Tag / StepNo / SceneFrame
└─ scenes/            01–15 各一屏
public/skill-mechanism/vo/   00.mp3 … 14.mp3（已做 loudnorm 归一）
```

---

## 3. 重做配音（改了文案之后）

配音是**最贵的一步**，改文案一定先改 `narration.ts`，再按下面顺序走：

```powershell
# 1) 批量合成（加载一次模型、复用音色 prompt，15 句约 20 分钟）
$env:PYTHONIOENCODING="utf-8"
& "D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe" .tmp\tts_batch.py

# 2) 音量归一（两遍 loudnorm → -16 LUFS / -1.5 dB）+ 输出时长表
python .tmp\normalize.py

# 3) 把实测时长回填进 narration.ts 的 vo 字段
python .tmp\fill_vo.py

# 4) 重新渲染
npm run lint
npx remotion render SkillMechanism "out\Skill机制与安装-解说.mp4"
```

参考音色取自 `effects/dsh-intro/audio/ref_voice.wav`（+ `ref_text.txt`），ICL 克隆模式。

**注意**：`.tmp/` 里的脚本是本次的可复用手稿，不进 git；若要长期保留，建议把
`tts_batch.py` / `normalize.py` / `fill_vo.py` 三个脚本挪到 `effects/skill-mechanism/audio/` 下。

---

## 4. 验收记录

| 项 | 结果 |
| --- | --- |
| 口播 15 句，总时长 | 115.28 s（合计画面 4109 帧 = 136.97 s，含每屏 0.6 s 入 + 0.85 s 出与 0.4 s 场景重叠） |
| 电平（逐句 volumedetect） | mean −16.6 ~ −16.7 dB，max −1.8 dB |
| 成片音频 | 时长 136.98 s（h264 1280×720 / 30fps，aac 48 kHz 立体声）；mean −17.4 dB，max −1.7 dB |
| 静音检查 | 除首帧 0.95 s 入镜静音与片尾 0.83 s 收尾外，静音段均出现在场景交界（每屏约 1.5–2.0 s，符合 0.6 s 入 + 0.85 s 出 + 0.4 s 重叠的设计），无异常长空白 |
| 排版 | 15 屏各渲中段静帧逐张核对，修正 6 处（标题溢出、卡片裁切、字幕带遮挡、空白失衡等） |
| `npm run lint` | 通过（eslint + tsc） |

---

## 5. 需要确认的事

1. **音色相似度必须由你本人试听确认**——我无法判断克隆声音像不像你。
2. 字幕胶囊是「一屏一句」的整句，不是逐字流式字幕；如需逐字高亮，要另加 `@remotion/captions` 与词级时间戳。
3. 若要做「学生端/学员端」使用的版本，按本校规定履行为 AI 生成内容的说明义务（本片配音为 AI 克隆音色）。