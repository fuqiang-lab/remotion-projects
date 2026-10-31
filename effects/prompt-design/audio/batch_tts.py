"""Qwen3-TTS 批量声音克隆：只加载一次模型，复用 voice clone prompt 逐句生成。

用法（工作目录必须含 narration.ts / audio/ref_0_14.wav / audio/ref_0_14.txt）：
    python batch_tts.py            # 生成全部 20 句
    python batch_tts.py 0 1 2      # 只生成指定索引（试听用）

输出：public/prompt-design/vo/NN.wav（24k 原始）+ durations.txt（“索引 秒数”）
"""
import json
import re
import sys
import time

import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

import os

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = r"D:\Models\qwen3-tts\Qwen3-TTS-12Hz-1.7B-Base"
REF_AUDIO = os.path.join(HERE, "ref_clean.wav")
REF_TEXT = os.path.join(HERE, "ref_clean.txt")
NARRATION = os.path.join(HERE, "..", "narration.ts")
OUT_DIR = os.path.join(HERE, "..", "..", "..", "public", "prompt-design", "vo")


def read_lines():
    src = open(NARRATION, encoding="utf-8").read()
    return re.findall(r'text: "([^"]+)",', src)


def main():
    wanted = {int(a) for a in sys.argv[1:] if a.isdigit()} if len(sys.argv) > 1 else None
    texts = read_lines()
    print("lines:", len(texts), flush=True)

    ref_text = open(REF_TEXT, encoding="utf-8").read().strip()
    t0 = time.time()
    model = Qwen3TTSModel.from_pretrained(
        MODEL_DIR,
        device_map="cuda:0",
        dtype=torch.bfloat16,
        attn_implementation="sdpa",
    )
    prompt = model.create_voice_clone_prompt(
        ref_audio=REF_AUDIO, ref_text=ref_text, x_vector_only_mode=False
    )
    # 诊断：prompt 里是否真的带上了参考音频的梅尔谱（为空时克隆会"失忆"，只剩默认音色）
    for item in prompt:
        for attr in ("ref_code", "ref_spk_embedding", "mel"):
            v = getattr(item, attr, None)
            if v is not None:
                shape = getattr(v, "shape", None)
                print("prompt", attr, shape, flush=True)
    print("model ready", round(time.time() - t0, 1), "s", flush=True)

    durations = {}
    import os

    os.makedirs(OUT_DIR, exist_ok=True)
    for i, text in enumerate(texts):
        if wanted is not None and i not in wanted:
            continue
        t = time.time()
        wavs, sr = model.generate_voice_clone(
            text=text, language="Chinese", voice_clone_prompt=prompt, non_streaming_mode=True
        )
        audio = np.asarray(wavs[0], dtype=np.float32)
        name = f"{i:02d}.wav"
        sf.write(os.path.join(OUT_DIR, name), audio, sr)
        durations[i] = round(len(audio) / sr, 2)
        print(i, name, durations[i], "s (gen", round(time.time() - t, 1), "s)", flush=True)

    with open("durations.txt", "w", encoding="utf-8") as f:
        for i in sorted(durations):
            f.write(f"{i} {durations[i]}\n")
    print("done", flush=True)


if __name__ == "__main__":
    main()