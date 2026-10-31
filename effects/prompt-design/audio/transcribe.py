import json
import sys

import soundfile as sf
import torch
from transformers import pipeline

wav_name = sys.argv[1]
out_name = sys.argv[2]

audio, sr = sf.read(wav_name, dtype="float32")
if audio.ndim > 1:
    audio = audio.mean(axis=1)

device = "cuda:0" if torch.cuda.is_available() and "--gpu" in sys.argv else "cpu"
print("device", device, "sr", sr, "len", round(len(audio) / sr, 2), flush=True)

asr = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",
    device=0 if device == "cuda:0" else -1,
    dtype=torch.float32,
)
result = asr(
    {"raw": audio, "sampling_rate": sr},
    return_timestamps=True,
    generate_kwargs={"language": "chinese", "task": "transcribe"},
)

with open(out_name, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("ok", flush=True)