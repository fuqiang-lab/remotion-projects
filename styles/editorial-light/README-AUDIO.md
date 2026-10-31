# 配音与音量规范

本风格成片 = 画面 + 人声口播 + 底部字幕胶囊。下面是本机已验证可用的配音流程。

## 1. 口播稿

- 一屏一句，句末不写标点也能念（TTS 会自然断句），句内逗号保留。
- 结论先行、口语化。避免书面长句（TTS 念长句会赶、会拖）。
- 语速约 5.5 字/秒 → 40 字 ≈ 7.3 秒，正好一屏。

## 2. 本机声音克隆（Qwen3-TTS）

```powershell
$py  = "D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe"
$cli = "D:\Apps\Qwen3-TTS\tts_cli.py"

# 参考音频先转成 16k 单声道 wav
ffmpeg -y -v error -i 你的样本.m4a -ac 1 -ar 16000 ref_voice.wav

# 克隆合成（需要参考音频对应的文字；不想暴露原文可加 -x）
& $py $cli voice-clone -t "要合成的一句话" -r ref_voice.wav -rt "参考音频的文字" -o 00.mp3
```

要点：

- 参考音频 **2–10 秒**最佳，环境安静、单人、无背景音乐。
- 模型：`Qwen3-TTS-12Hz-1.7B-Base`（克隆）、`-CustomVoice`（9 个预设音色）、`-VoiceDesign`（文字描述音色）。
- 每句约 1 分钟 GPU 时间，生成后建议试听再批量。
- 参考音频转文字可用 `transformers` 的 Whisper pipeline（本机 `HF_ENDPOINT=https://hf-mirror.com`）。

## 3. 音量归一（必做）

TTS 输出普遍偏轻且句间不一致（实测差可达 6 dB），统一到广播标准：

```powershell
ffmpeg -y -i in.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 1 tmp.wav
ffmpeg -y -i tmp.wav -c:a libmp3lame -b:a 192k out.mp3
```

验收：`ffmpeg -i out.mp3 -af volumedetect -f null NUL`，目标 `mean ≈ -16~-17 dB`、`max ≈ -1.8 dB`。

## 4. 合成进 Remotion

放在 `public/<作品>/vo/NN.mp3`，用 `@remotion/media` 的 `<Audio>` 按场景 `Sequence` 排：

```tsx
<Sequence from={start + VO_DELAY} durationInFrames={length}>
  <Audio src={staticFile(`dsh-intro/vo/${String(i).padStart(2, "0")}.mp3`)} volume={1} />
</Sequence>
```

- `VO_DELAY = 0.6s`：让标题先入场半秒再开口。
- **场景帧数 = 口播秒数 × fps + 入 0.6s + 出 0.85s**，保证不抢词。

## 5. 渲染注意

本机 `TEMP` 目录不可写时，ffmpeg 会报
`Error opening output ...\pre-encode.mp4: Permission denied`。
渲染前把临时目录指到工作区内即可：

```powershell
New-Item -ItemType Directory -Force -Path out\.tmp | Out-Null
$env:TEMP = (Resolve-Path "out\.tmp").Path; $env:TMP = $env:TEMP
npx remotion render <CompId> out/<name>.mp4
```