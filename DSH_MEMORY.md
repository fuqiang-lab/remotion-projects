<!-- dsh-memory:project-summary -->
# 项目摘要：c-users-fuqia-documents-aiworkspace-remotion-projects

> 项目 ID：`c-users-fuqia-documents-aiworkspace-remotion-projects` · 由 dsh-memory 自动维护 · 更新于 2026-10-31 08:29:23
> 只记录已做过的工作；经验教训与偏好不在此文件中。

## 2026-10-31

- `08:29` （decision） Remotion 工作区升级为交钥匙部署：新增 effects/smoke-test/index.tsx（Composition SmokeTest，270帧/9秒/无外部素材）作为部署自检标准，实测渲染 270 帧 9.000s 1280x720 30fps 通过。文档三件套为 部署方案-通用跨平台（交钥匙协议：只问工作区位置、依赖主动装、测到通过）、部署手册-Remotion（含工作区目录结构/启动方式/冒烟测试/验收）、使用指导书-Remotion工作区（素材放 input、参考视频放 References、示例提示词），三份均在 Obsidian 与仓库 docs/ 各有一份。
## 2026-10-28

- `15:45` （fact） Remotion 渲染不需要 GPU，普通 2D 内容加 GPU 也不会更快（本机 300 帧 720p 实测：默认 11.2s / --gl=angle 10.7s / --gl=egl 10.3s，差异在噪声内）。--hardware-acceleration 只管编码且映射为 macOS VideoToolbox / Windows·Linux NVENC（仅 NVIDIA）；AMD 机器上用 if-possible 会直接失败（h264_nvenc 报 Cannot load nvcuda.dll）且不回退软件编码。
- `15:33` （decision） Remotion 跨平台部署方案已建立：Obsidian 归档 OSpace/05-软件开发/Remotion视频制作/部署方案-Remotion-通用跨平台.md 为 canonical，仓库镜像 Remotion-Projects/docs/部署方案-通用跨平台.md（改内容先改 Obsidian 版再同步）。关键事实：官方支持 Windows x64 / macOS 15+ / Linux libc≥2.35，Alpine 与 nixOS 不支持；默认并发 = min(8, 核数/2)；浏览器缓存在工程内 node_modules/.remotion。
- `15:26` （note） Remotion 部署手册已归档到 OSpace/05-软件开发/Remotion视频制作/部署手册-Remotion.md（另配 README 索引），与工程内 docs/部署手册.md 同源；Remotion 现有 6 个 Composition（MyComp/DshIntro/SkillMechanism/PromptDesign/EditorialLightShowcase/DarkDeskShowcase），环境为 Node v24.22.0 + Remotion 4.0.536 + chrome-headless-shell 157.0.8080.0。
- `06:00` （fact · 结果：success） whisper-small 在 CPU 上转录 11 秒中文音频会退化成重复串（"我愛你×100"/"啊×200"），但在 ROCm GPU（device="cuda:0"，torch.cuda.is_available() 为 True）上正常；本项目用 GPU 做 ASR 回读校验 TTS 输出。
- `06:00` （fix · 结果：success） Qwen3-TTS 声音克隆：参考音频里混入参考文本之外的声音（剪辑残留半句）会被模型当成音色特征，导致每句配音开头都复现那段残音；只把开头置零无效。做法是按静音边界重剪参考音频（effects/prompt-design/audio/make_ref.py），并用 whisper-small 在 CUDA 回读（audio/asr_check.py）与参考文本逐字核对。
