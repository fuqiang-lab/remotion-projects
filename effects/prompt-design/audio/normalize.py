"""批量归一：public/prompt-design/vo/*.wav → loudnorm 后的 *.mp3（与 skill-mechanism 同一流程）。"""
import glob
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
VO = os.path.abspath(os.path.join(HERE, "..", "..", "..", "public", "prompt-design", "vo"))
TMP = os.path.abspath(os.path.join(HERE, "..", "..", "..", "out", "norm-tmp"))
os.makedirs(TMP, exist_ok=True)

rows = []
for wav in sorted(glob.glob(os.path.join(VO, "*.wav"))):
    stem = os.path.splitext(os.path.basename(wav))[0]
    tmp = os.path.join(TMP, stem + ".norm.wav")
    mp3 = os.path.join(VO, stem + ".mp3")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
         "-ar", "48000", "-ac", "1", tmp],
        check=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", tmp, "-c:a", "libmp3lame", "-b:a", "192k", mp3],
        check=True,
    )
    dur = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3],
        capture_output=True, text=True,
    ).stdout.strip()
    log = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", mp3, "-af", "volumedetect", "-f", "null", "NUL"],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    ).stderr
    mean = re.search(r"mean_volume: (-?[\d.]+)", log)
    peak = re.search(r"max_volume: (-?[\d.]+)", log)
    rows.append((stem, dur, mean.group(1) if mean else "?", peak.group(1) if peak else "?"))

with open(os.path.join(HERE, "measure.txt"), "w", encoding="utf-8") as f:
    f.write("file\tduration\tmean\tpeak\n")
    for r in rows:
        f.write("\t".join(r) + "\n")
print("normalized", len(rows))