"""测量生成的配音时长与电平（写 UTF-8 文件，避免控制台 GBK 乱码）。"""
import glob
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
VO = os.path.join(HERE, "..", "..", "..", "public", "prompt-design", "vo")

rows = []
for path in sorted(glob.glob(os.path.join(VO, "*.mp3"))):
    name = os.path.basename(path)
    dur = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True,
        text=True,
    ).stdout.strip()
    log = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-af", "volumedetect", "-f", "null", "NUL"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    ).stderr
    mean = re.search(r"mean_volume: (-?[\d.]+)", log)
    peak = re.search(r"max_volume: (-?[\d.]+)", log)
    rows.append((name, dur, mean.group(1) if mean else "?", peak.group(1) if peak else "?"))

with open(os.path.join(HERE, "measure.txt"), "w", encoding="utf-8") as f:
    f.write("file\tduration\tmean\tpeak\n")
    for r in rows:
        f.write("\t".join(r) + "\n")
print("measured", len(rows))