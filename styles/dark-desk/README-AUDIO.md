# 配音流水线（Qwen3-TTS 声音克隆 → 归一 → 排进时间线）

本文件记录 `effects/prompt-design/` 实际跑通的一套流程，含**踩过的坑**。音频脚本都在 `effects/prompt-design/audio/`。

---

## 1. 参考音频：先剪干净，再克隆（最关键）

参考音频只用来"定音色"，**里面任何不属于参考文本的声音都会被学进音色**——实测踩了两次：

1. 参考片段末尾多出半句（剪辑时没对齐），结果**每一句配音开头都被念成"黑白相间、粗细不同的条状符号……"**；
2. 手动把开头 0.6 s 置零并不能解决，只要参考文本与音频对不上，模型就会把残留音频当"音色特征"复现。

做法：

```powershell
# 按静音边界剪出干净片段（自带 0.15 s 静音垫）
$py = "D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe"
& $py effects\prompt-design\audio\make_ref.py `
      --src "References\付强声音新录制.m4a" --start 1.4 --end 12.0 `
      --out effects\prompt-design\audio\ref_clean.wav
```

然后**必须**把剪出的音频再转一遍成文字核对：

```powershell
& $py effects\prompt-design\audio\asr_check.py <ref_clean.wav 转成的 16k wav>
# 结果写在 out/asr_check.txt
```

转出来的文字要与 `ref_clean.txt` 逐字对得上（标点可忽略）。多一个字、少一个字都要重剪。

---

## 2. 口播稿（`narration.ts`）

- 一屏一句，40 字以内，结论先行。
- **逗号是 TTS 的停顿提示**：一句里没有逗号，TTS 会一口气念完（实测 30 字无逗号 ≈ 无停顿）。想让人听出层次，就按语义加逗号。
- 改词后只重生成那几句：`batch_tts.py 3 7 12`。

---

## 3. 批量合成（`batch_tts.py`）

```powershell
$env:PYTHONIOENCODING="utf-8"
& "D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe" effects\prompt-design\audio\batch_tts.py 0 1 2 ... 19
```

- 模型只加载一次，`create_voice_clone_prompt` 复用；ICL 模式（`x_vector_only_mode=False`）。
- 输出 `public/prompt-design/vo/NN.wav`（24k 单声道）+ `durations.txt`。
- 耗时参考：干净参考音频下**约 1.5–3 分钟/句**（比短参考慢，因为参考上下文更长），20 句 ≈ 40 分钟。
- 启动行会打印 `prompt ref_code ... ref_spk_embedding ...`；为空说明参考音频没进来，赶紧停下。

### 生成后必做：ASR 回读

```powershell
# 1) 把 mp3/wav 统一转 16k 单声道
ffmpeg -y -v error -i public\prompt-design\vo\00.wav -ac 1 -ar 16000 out\vo16b\00.wav
# 2) GPU 上跑 whisper-small 回读（CPU 会很慢，device="cuda:0" 走 ROCm）
& $py effects\prompt-design\audio\asr_check.py <一批 wav>
```

逐句比对：**开头有没有多念词、关键词有没有念错（"跃迁"常被听成"月签"属正常同音误判）、句子有没有被截断**。

---

## 4. 音量归一（`normalize.py`）

```powershell
& "C:\...\python.exe" effects\prompt-design\audio\normalize.py
```

- `loudnorm=I=-16:TP=-1.5:LRA=11` → 48 kHz 单声道 → mp3 192k。
- 输出 `public/prompt-design/vo/NN.mp3` + `measure.txt`。
- 验收：`mean ≈ -16 ~ -17.6 dB`、`peak ≈ -1.8 dB`。实测 20 句全在 `-15.9 ~ -17.6 / -1.7 ~ -1.8`。

---

## 5. 回填到时间线

1. 把 `measure.txt` 的时长写回 `narration.ts` 的 `vo` 字段（脚本 `out/fill_vo.py` 的做法：正则替换 `vo: 0,`）。
2. 每屏帧数 = `vo × fps + 0.6 × fps + 0.85 × fps`；口播起点在场景内 `0.6 s` 处。
3. `index.tsx` 里用 `@remotion/media` 的 `<Audio>`，按场景 `Sequence` 的 `from + 0.6×fps` 排。

---

## 6. 检查清单

- [ ] 参考音频 8–12 s、单人、无背景音、首尾静音
- [ ] 参考文本与音频逐字一致（ASR 回读核对）
- [ ] 句内该停的地方有逗号
- [ ] 全部句子 ASR 回读无多余开头 / 无截断
- [ ] 全部过 `loudnorm`，`mean ≈ -16 dB`
- [ ] `vo` 字段已按实测回填，**不要手填估时**
- [ ] 音色相似度**由用户试听确认**后才能对外说"像"