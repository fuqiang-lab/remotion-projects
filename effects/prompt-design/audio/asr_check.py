"""ASR 快速校验：对指定 wav 用 CUDA 跑 whisper-small（4.57 的 device 参数走 torch.cuda）。"""
import sys

import soundfile as sf
import torch
from transformers import pipeline

paths = sys.argv[1:]
audio = []
SR = 16000
for p in paths:
    a, sr = sf.read(p, dtype="float32")
    if a.ndim > 1:
        a = a.mean(axis=1)
    assert sr == SR, (p, sr)
    audio.append(a)

asr = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",
    device="cuda:0" if torch.cuda.is_available() else "cpu",
    dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
)
print("device", torch.cuda.is_available(), flush=True)

out = []
for p, a in zip(paths, audio):
    r = asr({"raw": a, "sampling_rate": SR}, generate_kwargs={"language": "chinese", "task": "transcribe"})
    out.append((p, r["text"].strip()))

with open("out/asr_check.txt", "w", encoding="utf-8") as f:
    for p, t in out:
        f.write(f"{p}\n{t}\n\n")
print("ok", len(out), flush=True)