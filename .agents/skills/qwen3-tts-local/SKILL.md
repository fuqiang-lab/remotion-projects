---
name: qwen3-tts-local
description: Use the locally deployed Qwen3-TTS to synthesize or clone speech (中文配音), batch-generate narration for videos, and normalize audio to broadcast loudness. Covers the CLI, voice clone reference requirements, timing costs, and Windows/AMD ROCm gotchas.
version: 1.0.0
---

# 本机 Qwen3-TTS 语音合成 / 声音克隆

> 本机（Windows 原生 + AMD Radeon 8060S / ROCm）已部署 Qwen3-TTS。
> 用于给视频配音：**声音克隆**、预设音色、文字描述音色三种模式。
> 相关笔记：`styles/editorial-light/README-AUDIO.md`（在 Remotion 项目里如何接线）。

## 何时用本 skill

- 用户要给视频/课件**配音**，或提到「用我的声音」「克隆音色」「配音」「旁白」。
- 需要批量生成多句口播并统一音量。
- 用户问本机 TTS 怎么用、为什么生成慢/没声音。

**不要**在没有用户明确要求时自动生成配音——生成很慢（见耗时表），先确认文案。

## 环境（已就绪，勿重装）

| 项 | 值 |
| --- | --- |
| 解释器 | `D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe`（Python 3.12，torch 2.11 + rocm7.13） |
| CLI | `D:\Apps\Qwen3-TTS\tts_cli.py` |
| 模型目录 | `D:\Models\qwen3-tts\` |
| GPU | AMD Radeon(TM) 8060S Graphics（ROCm） |
| 采样率 | 输出 24kHz；参考音频内部会重采样到 24k |

三个模型（按用途自动选择）：

| 模型 | 子命令 | 用途 |
| --- | --- | --- |
| `Qwen3-TTS-12Hz-1.7B-Base` | `voice-clone` | 声音克隆（最常用） |
| `Qwen3-TTS-12Hz-1.7B-CustomVoice` | `custom-voice` | 9 个预设音色 |
| `Qwen3-TTS-12Hz-1.7B-VoiceDesign` | `voice-design` | 用文字描述造音色 |

## 声音克隆（标准流程）

### 1. 准备参考音频

```powershell
ffmpeg -y -v error -i 样本.m4a -ac 1 -ar 16000 ref_voice.wav
```

- **2–10 秒**最佳，单人、安静、无背景音乐。过长不会更好，反而拖慢。
- 支持 m4a/mp3/wav：CLI 走 librosa，ffmpeg 转好的 16k 单声道 wav 最稳。

### 2. 取得参考音频的文字（关键）

ICL 克隆模式**必须**提供参考音频对应的原文，否则效果退化。

```powershell
# 用 transformers 的 Whisper 转录（本机 HF_ENDPOINT 已设为 hf-mirror.com）
$py = "D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe"
& $py -c "
import soundfile as sf
from transformers import pipeline
a, sr = sf.read('ref_voice.wav', dtype='float32')
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small', device=0)
r = asr({'raw': a, 'sampling_rate': 16000}, generate_kwargs={'language':'chinese','task':'transcribe'})
open('ref_text.txt','w',encoding='utf-8').write(r['text'].strip())
"
Get-Content ref_text.txt -Encoding UTF8   # 务必人工核对错别字
```

> 终端直接打印中文会乱码（GBK），**一律写文件再读**。

如果用户不愿提供/暴露原文，可用 x-vector 模式（见下），但 CLI 的 `-rt` 仍是必填参数——
传任意占位文本即可，该参数会被忽略。

### 3. 合成

```powershell
$py  = "D:\Apps\Qwen3-TTS\.venv\Scripts\python.exe"
$cli = "D:\Apps\Qwen3-TTS\tts_cli.py"

# ICL 模式（推荐，音色与韵律最像）
& $py $cli voice-clone -t "要合成的一句话" -r ref_voice.wav -rt (Get-Content ref_text.txt -Raw) -o 00.mp3

# x-vector 模式（只取音色嵌入；-rt 传占位即可，仍必填）
& $py $cli voice-clone -x -t "要合成的一句话" -r ref_voice.wav -rt "占位" -o 00.mp3
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `-t/--text` | 待合成文本 |
| `-r/--ref-audio` | 参考音频路径（或 URL / (np, sr) 元组） |
| `-rt/--ref-text` | 参考音频原文，**必填** |
| `-x/--x-vector-only` | 仅音色嵌入；会忽略 ref_text |
| `--lang` | 默认 `Chinese`（另有 English/Japanese/Korean 等） |
| `--device` | 默认 `cuda:0`（ROCm 下即 AMD 显卡） |
| `--fp32` | 默认 bf16；显存紧张时保持默认 |
| `-o/--out` | 输出路径 |

### 4. 批量生成（避免逐条冷启动）

CLI 是「一次进程 = 加载一次模型」，逐句调用会重复付加载成本。
多句时**写一个脚本，加载一次、复用 prompt、循环生成**：

```python
import soundfile as sf
from qwen_tts import Qwen3TTSModel
import torch

m = Qwen3TTSModel.from_pretrained(
    r"D:\Models\qwen3-tts\Qwen3-TTS-12Hz-1.7B-Base",
    device_map="cuda:0", dtype=torch.bfloat16, attn_implementation="sdpa",
)
ref_text = open("ref_text.txt", encoding="utf-8").read().strip()
prompt = m.create_voice_clone_prompt(
    ref_audio="ref_voice.wav", ref_text=ref_text, x_vector_only_mode=False,
)
for i, text in enumerate(open("lines.txt", encoding="utf-8").read().splitlines()):
    if not text.strip():
        continue
    wavs, sr = m.generate_voice_clone(text=text, language="Chinese", voice_clone_prompt=prompt)
    sf.write(f"vo/{i:02d}.wav", wavs[0], sr)
    print(i, text[:12], round(len(wavs[0]) / sr, 2), flush=True)
```

## 耗时（AMD 8060S / ROCm 实测）

| 场景 | 耗时 |
| --- | --- |
| 冷启动加载模型 | ~4–11 s |
| 逐句 CLI 调用（新进程） | **~3–4 分钟 / 句**（含加载；实测 43 字 ≈ 203 s） |
| 批处理脚本（加载一次，prompt 复用） | 明显更快，句数越多优势越大 |
| 参考音频（25 s）prompt 构建 | 一次性，秒级 |

结论：**≥3 句就一定写批处理脚本**；单句才用 CLI。生成期间是 GPU 满载，
可并行做文案/画面工作，不要重复启动多个进程抢显存。

## 音量归一（几乎所有配音都要做）

TTS 输出偏轻，且**句与句之间能差 6 dB**，必须统一：

```powershell
foreach ($f in Get-ChildItem vo\*.mp3) {
    $tmp = "$($f.FullName).norm.wav"
    ffmpeg -y -v error -i $f.FullName -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 1 $tmp
    ffmpeg -y -v error -i $tmp -c:a libmp3lame -b:a 192k $f.FullName
    Remove-Item $tmp
}
# 验收：mean ≈ -16~-17 dB，max ≈ -1.8 dB
ffmpeg -hide_banner -i vo\00.mp3 -af volumedetect -f null NUL 2>&1 | Select-String 'mean_volume|max_volume'
```

## 常见问题

| 现象 | 原因 / 处理 |
| --- | --- |
| `the following arguments are required: -rt/--ref-text` | 即使加了 `-x` 仍必填，传占位文本 |
| 终端打印中文是乱码 | 控制台 GBK；让脚本写 UTF-8 文件再 `Get-Content -Encoding UTF8` |
| `SoX could not be found!` | 启动时的无害告警（librosa 后端），不影响生成 |
| `flash-attn is not installed` | 无害告警，走 sdpa 即可，无需安装 |
| `MIOpen ... workspace required` | ROCm 正常提示，不影响 |
| 音色不像 / 语气飘 | ①参考音频太长或太吵；②`-rt` 文本与音频不符；③改用 ICL 而非 `-x` |
| 生成极慢 | 检查是否逐句冷启动；改批处理脚本 |
| 首次跑模型下载 | `HF_ENDPOINT=https://hf-mirror.com` 已配置；模型应已存在于 `D:\Models\qwen3-tts` |

## 与视频对接

生成好的 `vo/NN.mp3` 放 `public/<作品>/vo/`，用 `@remotion/media` 的 `<Audio>` 按场景 `Sequence` 排；
**场景帧数 = 口播秒数 × fps + 0.6s 入 + 0.85s 出**。完整示例见
`styles/editorial-light/README-AUDIO.md`。

## 验收清单

- [ ] 参考音频 2–10 s、单人、无噪音
- [ ] `ref_text.txt` 已人工核对（错字会直接读出来）
- [ ] 多句用批处理脚本生成
- [ ] 全部句做过 loudnorm，`volumedetect` 达标
- [ ] 抽样试听，确认与用户本人音色相符（**未经用户试听不要声称「像」**）