# Agents.md

> 面向所有 AI Agent 的目录说明。动手前先读完本文件。

`Remotion-projects` 是**用 React 代码创作 Remotion 视频动画的工作区**（单个 Remotion 工程）。每个作品是一个 React 组件，动画由 `useCurrentFrame()` 推导，最终渲染为 MP4/WebM。技术栈：TypeScript + React 19。

## 两条硬约束

1. **所有新建动画一律在 `effects/` 下开发**，不得往 `src/` 或根目录新增文件，避免污染脚手架与工作区。
   - 目录形式：`effects/<作品名>/index.tsx`（组件）+ `effects/<作品名>/` 内放该作品自己的素材与子组件。
   - 资源引用用 `staticFile()` 时需要文件在 `public/`；若作品自带素材，优先用 `import` 方式引入，确需 `public/` 时先征求用户同意。
   - `src/`（`index.ts`、`Root.tsx`、`Composition.tsx`）只做必要的**注册**改动：在 `src/Root.tsx` 中 `import` 并在 `<Composition id="..." />` 注册即可，不在此新增业务逻辑。
2. **默认只做预览，不渲染**。用户说"做个视频"意味着在 Studio 里能看到并调整；只有明确说"渲染 / 导出 / 给 MP4"才执行 `remotion render`。

## 环境（已就绪，勿重复安装）

- Node v24.22.0 / npm 11.18.0；Remotion 4.0.536（`remotion` 与所有 `@remotion/*` 同版本）；React 19.2.3。
- 已装：`mediabunny`、`gsap`、`zod`、`@remotion/google-fonts` 等。**未装**：`tailwindcss`、`three`、`lottie-web`，需要用先问用户。
- Skills 已装 12 个（`.agents/skills/`、`.claude/skills/`），清单见 `skills-lock.json`。
- 本项目**自建 skill**：`.agents/skills/qwen3-tts-local/`（本机 Qwen3-TTS 配音/声音克隆）。自建 skill 不写入 `skills-lock.json`（该文件只登记 GitHub 来源）。
- 配音用本机 Qwen3-TTS：`D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe` + `tts_cli.py`（细节见 `qwen3-tts-local` skill）。
- `node_modules` 约 5.4 万文件 / 1.96 GB，**禁止批量读取或搜索**。

## 部署手册

| 文档 | 用途 |
| --- | --- |
| **[docs/部署方案-通用跨平台.md](docs/部署方案-通用跨平台.md)** | **在别的电脑上部署时看这份**：最低硬件要求（三档）→ 交钥匙协议 → 10 个阶段；含 OS 支持矩阵、Linux 依赖、离线部署、故障决策树 |
| [docs/部署手册.md](docs/部署手册.md) | 本机环境的安装步骤、版本基线、工作区目录结构、启动方式、冒烟测试与验收 |
| [docs/使用指导书-工作区.md](docs/使用指导书-工作区.md) | **交付给用户**的使用说明：素材/参考视频放哪、示例提示词 |

> **交钥匙约定**：新机器部署的唯一需要问用户的是"工作区放哪里"；缺失依赖（Node/ffmpeg/系统库/无头浏览器）**直接装**，装完报告版本，然后建目录结构 → 部署 → 渲染 `SmokeTest` 验证 → 循环直到全部通过 → 生成使用指导书。

环境变动（版本、路径、依赖）时，本文件与手册**一起改**。三份文档另有一份 Obsidian 归档：`OSpace/05-软件开发/Remotion视频制作/`。

## 目录

```
├─ docs/             ★ 文档：部署方案 / 部署手册 / 使用指导书（不参与渲染）
├─ input/            ★ 用户原始素材：PPT / Word / PDF / 图片（只进不出，不是渲染资源）
├─ src/index.ts     入口 registerRoot，基本不改
├─ src/Root.tsx     所有 Composition 的注册处
├─ src/Composition.tsx  骨架示例 MyComp（1280x720 / 30fps / 60 帧）
├─ effects/         ★ 新动画全部在此开发
├─ styles/          ★ 风格库：每种视频风格一个子目录（规范 README + 可复用组件）
├─ public/          静态资源根目录（staticFile 引用）
├─ References/      参考视频素材存放处（只读参考，不参与渲染，不放入 public/）
├─ remotion.config.ts   渲染配置（Rspack、jpeg 帧、覆盖输出）
├─ out/  dist/      渲染 / 打包产物（git 忽略）
```

## 风格库

| 风格 | 目录 | 说明 |
| --- | --- | --- |
| Editorial Light（米白编辑风） | `styles/editorial-light/` | 出自 `References/remotion视频创作教程.mp4`；白卡 + 淡蓝地台 + 深灰口播胶囊 |
| Dark Desk（暗色讲台风） | `styles/dark-desk/` | 出自 `References/动画效果.mp4`；暗底 + 深灰卡 + 橘色强调 + 白色粉笔线/圈 + 深色口播胶囊 |

- 做**新视频**时先看 `styles/<风格>/README.md`，复用其 `theme.ts` / `ui.tsx`，不要复制粘贴样式常量。
- `src/Root.tsx` 里的 `EditorialLightShowcase` / `DarkDeskShowcase` 是风格样本 Composition，改风格组件后可在这里快速核对。
- 配音流程（本机 Qwen3-TTS 声音克隆 + 音量归一）见 `styles/editorial-light/README-AUDIO.md`；
  Dark Desk 版（含参考音频剪裁与 ASR 回读）见 `styles/dark-desk/README-AUDIO.md`。
- Dark Desk 成片示例：`effects/prompt-design/`（《AI 提示词设计方法与优化策略》精讲，20 屏 / 3 分 21 秒，Composition `PromptDesign`）。

## 命令

```bash
npm run dev    # remotion studio，预览（长驻，默认 http://localhost:3000/<CompId>）
npm run lint   # eslint src && tsc，提交前必跑
npm run build  # remotion bundle
npx remotion render <CompId> out/<name>.mp4
```

> `effects/` 新文件同样要过 lint；改 `npm run lint` 脚本前先确认用户同意。

## 踩过的坑（已实际发生，先看这里再动手）

每条按「**现象 → 原因 → 做法**」记录。遇到相同现象直接照做，不要重新试错。

### A. 环境 / 渲染

| 现象 | 原因 | 做法 |
| --- | --- | --- |
| `spawn EPERM`（`remotion studio` / `render` / `still` 都报） | 沙箱不允许 Remotion 启动 Chrome 子进程 | 渲染与 Studio 需在放开的权限下执行；**这不是代码问题**，别去改代码或重装依赖 |
| `Error opening output ...\react-motion-renderXXX\pre-encode.mp4: Permission denied` | 系统 `TEMP` 指向不可写目录 | 渲染前 `New-Item -ItemType Directory -Force out\.tmp` 并 `$env:TEMP=$env:TMP=(Resolve-Path out\.tmp).Path`，再执行 render |
| 渲染报错但 `still` 单帧正常 | 单帧不走 ffmpeg 合成 | 用 `--frames=0-299` 先渲 10 秒样本验证音视频，再整片导出 |
| 终端打印中文变成乱码 | Windows 控制台是 GBK | 脚本**写 UTF-8 文件**再 `Get-Content -Encoding UTF8`；不要靠 `print` 看中文 |
| 按部署手册 `git clone` 到新机器，**作品在但配音没了** | 这是**有意设计**：公开仓库（`github.com/fuqiang-lab/remotion-projects`）排除了 `References/`、`input/`、`effects/*/audio/`、`public/*/vo/`——声音样本可被用来复刻本人音色 | 只要代码/文档 → clone 即可；要**带声音渲染** → 从源机拷回 `public/<作品>/vo/` 与 `effects/<作品>/audio/`，或用本机 Qwen3-TTS 重生成。需要完整环境时用 robocopy 打包迁移（排除 `node_modules`、`out`、`dist`、`.git`、`References`），迁完用 `npx remotion compositions` 对账，**两边都应是 7 个** |

### B. 布局 / 版式（均已踩过并修复）

| 现象 | 原因 | 做法 |
| --- | --- | --- |
| 大标题换行、溢出屏幕 | 字号按"看着差不多"给，未留安全边距 | 中文标题按宽度反算字号（1280 宽下主标题 ≤ 86px），并加 `whiteSpace: "nowrap"` 后渲染静帧确认 |
| 卡片与下方说明条/按钮重叠 | 卡高 + 间距之和超过可用高度 | 主体区固定在 `y=200 ~ y=490`，先把总高算出来再定卡高 |
| 列表行被卡片底边裁切 | 卡片 `height` + `overflow:hidden` 装不下动态行数 | 行数不定时不要写死高度，或把行内边距压下来后重新核算 |
| 并列图示被容器裁切 | 图元宽度 × 个数 + 间距 > 容器宽 | 先算 `n*w + (n-1)*gap` 再定尺寸 |
| 汇总卡高低不齐 | 内容行数不同 + `justify-content: space-between` | 改等宽等高容器，文字块用 `marginTop: "auto"` 贴底 |
| 口径／序号前后不一致（如 `01 / 02` 实为 11 个场景） | 早期草稿数字没跟着改 | 分页/计数一律由数据推导（`SCENES.length`），不写死 |

**通用做法**：每屏改完挑**中段帧**（避开入场动画）渲一张静帧逐张看。上面 6 条都是这样发现的，Studio 里滚动播放容易漏掉。

### C. 动画 / 场景切换

| 现象 | 原因 | 做法 |
| --- | --- | --- |
| 场景切换时闪出空白底板 | 每个场景自己包了一层背景，淡出→淡入之间露出父级 | **底色由父级统一提供**，场景只做透明度淡入淡出；Sequence 之间留约 12 帧重叠 |
| 首帧/末帧内容"跳"出来 | 硬切，没有过渡 | `SceneFrame` 统一做 14 帧首尾淡化 |
| 加 `paddingBottom` 后顶部导航错位 | 导航是 `position:absolute`，受父级 padding 影响 | 导航与内容分层，padding 只加在内容层 |

### D. 配音（Qwen3-TTS）

| 现象 | 原因 | 做法 |
| --- | --- | --- |
| `the following arguments are required: -rt/--ref-text` | 即使加 `-x`（仅音色嵌入）该参数仍必填 | 传任意占位文本，`-x` 下会被忽略 |
| 配音耗时失控（>1 小时） | 逐句起新进程，每句都冷启动重载模型 | **≥3 句必须写批处理脚本**：加载一次 + `create_voice_clone_prompt` 复用；实测逐句约 3–4 分钟/句 |
| 句与句音量忽大忽小 | TTS 输出电平随机波动，句间差可达 6 dB | 全部过 `loudnorm=I=-16:TP=-1.5:LRA=11`，验收 `mean≈-16~-17dB / max≈-1.8dB` |
| 音色不像 / 语气飘 | 参考音频太长或吵；`-rt` 与实际音频不符；用了 `-x` | 参考音频取 2–10 s 单人不带背景音；转录文本人工核对；优先 ICL 模式 |
| 某屏话没说完就切了 | 先定死每屏时长，后配音 | **场景帧数 = 口播秒数 × fps + 0.6s 入 + 0.85s 出**，由音频反推画面 |
| 每句开头都多念一句"黑白相间、粗细不同的条状符号…" | 参考音频末尾多出半句，参考文本对不上；模型把这段残音当"音色"复现 | 参考音频按静音边界重剪（`audio/make_ref.py`），剪完**必须 ASR 回读**核对与 `ref_clean.txt` 逐字一致；只把开头置零无效 |
| 一句 30 字念完没有任何停顿 | 参考音频几乎没有停顿，且原句无逗号 | 口播稿按语义加逗号；参考音频取 8–12 s、句间有自然停顿的片段 |
| 试听像"不像本人"，但没人听过 | 只用 ASR 验证过内容，没验证音色 | ASR 回读只证明"念对了词"，**音色必须用户本人试听确认** |
| `SoX could not be found` / `flash-attn is not installed` / `MIOpen ... workspace` | 均为启动期无害告警 | 忽略，无需安装 |

### E. 素材 / 风格

| 现象 | 原因 | 做法 |
| --- | --- | --- |
| 风格"看着像"但复刻不准 | 凭印象描述颜色（如把冷调米白记成暖白） | **抽帧 + 逐像素取色**，把实测色值写进 `styles/<风格>/README.md`；Pillow 新版用 `get_flattened_data()` |
| 一个作品里样式逐渐走样 | 每个场景各写一套字号/圆角/阴影 | 只用 `styles/<风格>/theme.ts` 与 `ui.tsx`，需要新样式先加进风格库 |

## 做一个新视频：复用清单

按顺序勾，每一步做完再进下一步。**顺序本身就是经验**——最容易返工的是"先定画面时长、后配音"。

### 阶段 1 · 定风格（未定风格不要开始写场景）

- [ ] 参考片抽帧 + 逐像素取色，把**实测色值/字号/边距**写进 `styles/<风格>/README.md`
- [ ] 没有现成风格时新建 `styles/<风格>/`（`theme.ts` + `ui.tsx` + README），而不是在场景里写死样式
- [ ] 在 `src/Root.tsx` 注册一个 showcase Composition，先把版式跑通再填内容

### 阶段 2 · 写文案（配音最贵，先在纸上完成）

- [ ] 口播稿一屏一句、结论先行，单句 ≤ 40 字（约 5.5 字/秒）
- [ ] 文案**定稿后**才进入配音，不要在配音过程中反复改词
- [ ] 口播稿写成单一事实来源文件（如 `narration.ts`），场景时长由它推导

### 阶段 3 · 配音

- [ ] 参考音频转 16k 单声道：`ffmpeg -i 样本.m4a -ac 1 -ar 16000 ref_voice.wav`（取 2–10 s 干净片段）
- [ ] 转录参考音频原文并**人工核对错字**（错字会被直接念出来）
- [ ] 多句用批处理脚本生成，不逐句起进程（见 `qwen3-tts-local` skill）
- [ ] 全部音频 `loudnorm=I=-16:TP=-1.5:LRA=11` 归一，`volumedetect` 确认 `mean≈-16~-17dB`

### 阶段 4 · 画面

- [ ] 场景帧数 = **口播秒数 × fps + 0.6s 入 + 0.85s 出**
- [ ] 底板由父级统一提供，场景只做透明度过渡，Sequence 间留 ~12 帧重叠
- [ ] 主体内容在 `y=200~490`，底部留 124px 字幕带
- [ ] 只用 `styles/<风格>/theme.ts` 的色值与字号，不临时新造样式
- [ ] 计数/分页由数据推导（`SCENES.length`），不写死

### 阶段 5 · 验收与导出

- [ ] 每屏挑**中段帧**渲静帧逐张看排版（`npx remotion still <CompId> out.tmp/f.png --frame=N`）
- [ ] `npm run lint` 通过
- [ ] 先渲 10 秒样本确认音视频都在：`--frames=0-299`
- [ ] 设好 `$env:TEMP`（见坑 A），再整片 `npx remotion render`
- [ ] 导出后三项验收：**时长**一致、**电平**达标（mean −16~−17 dB）、**静音**检查无异常长空白

> 配音未试听前**不要**声称"音色像用户本人"——音色相似度必须由用户本人确认。

## 约定

- **先加载 skill**：任何 Remotion 任务先加载 `remotion-best-practices`（路由总表），再按需加载子 skill，不凭记忆写 API。
- **帧模型**：动画只用 `useCurrentFrame()` + `interpolate`/`spring`；禁用 `setState` 驱动动画、`Date.now()`、`Math.random()`（随机用 `random(seed)`）。
- **命名**：Composition `id` 用有意义的名字，不用 `MyComp` 式占位名。
- **保留骨架**：除用户要求，不删除 `MyComp` / `NewComposition.tsx`。
- **改完必验**：`npm run lint` 通过（`noUnusedLocals` 会让未使用 import 报错），并在 Studio 中确认预览可加载。
- **版本一致**：`@remotion/*` 必须同版本，升级走 `remotion-upgrade` skill。
- **尊重用户改动**：对话外的意外代码变动不要覆盖，先确认。
- **不动 git 历史**：提交与否由用户决定。`remotion.config.ts` 已开启覆盖输出，渲染前确认路径。

## 速查

| 需求 | skill |
| --- | --- |
| 新建视频 / 动画结构 | `remotion-create` |
| 动画、文字、转场、音频 | `remotion-markup` |
| 地图动画 | `remotion-maps` |
| 字幕 / 转录 | `remotion-captions` |
| 导出 MP4/WebM | `remotion-render` |
| 预览调试 Studio | `remotion-studio` |
| 查官方 API | `remotion-docs` |
| 多媒体时长/裁剪 | `remotion-multimedia` |
| Player / Lambda / 渲染服务 | `remotion-saas` |
| 本机配音 / 声音克隆 | `qwen3-tts-local` |

本文件与代码现状不符时以代码为准，并顺手更新本文件。