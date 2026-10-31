"""按静音切出干净的参考音频（去掉首尾与内部超长停顿）。

用法：python make_ref.py --src "References/付强声音新录制.m4a" --start 2.0 --end 12.0 --out ref_clean.wav
参考音频只用于克隆音色，任何"不属于参考文本"的声音（多出来的半句、口哨、喷麦）都会被
模型学进音色里，所以切完必须听一遍 / 转一遍确认没有多余内容。
"""

import argparse
import os
import subprocess

import numpy as np
import soundfile as sf


def load_any(src: str) -> tuple[np.ndarray, int]:
    """用 ffmpeg 解码成 16k 单声道（避免依赖 m4a 读取库）。"""
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_tmp_ref.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", out],
        check=True,
    )
    a, sr = sf.read(out, dtype="float32")
    os.remove(out)
    return a, sr


def trim(a: np.ndarray, sr: int, start: float, end: float, lead: float = 0.15, tail: float = 0.15):
    """在地面噪声之上找区间内的语音起点，再两侧各留 lead / tail，两端补静音。"""
    seg = a[int(start * sr) : int(end * sr)].copy()
    win = int(sr * 0.02)
    e = np.array(
        [np.sqrt((seg[i : i + win] ** 2).mean()) for i in range(0, len(seg) - win, win)]
    )
    floor = np.percentile(e, 10)
    voiced = np.where(e > max(floor * 4, 0.005))[0]
    if len(voiced) == 0:
        raise SystemExit("区间内没有检测到语音，检查 --start / --end")
    first = voiced[0] * 0.02 - lead
    last = (voiced[-1] + 1) * 0.02 + tail
    first = max(0.0, first)
    last = min(len(seg) / sr, last)
    body = seg[int(first * sr) : int(last * sr)]
    pad = np.zeros(int(sr * 0.15), dtype=np.float32)
    return np.concatenate([pad, body, pad])


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--src", required=True)
    p.add_argument("--start", type=float, required=True)
    p.add_argument("--end", type=float, required=True)
    p.add_argument("--out", required=True)
    args = p.parse_args()

    a, sr = load_any(args.src)
    out = trim(a, sr, args.start, args.end)
    sf.write(args.out, out, sr)
    print(f"{args.out}  {len(out) / sr:.2f}s  {sr}Hz")


if __name__ == "__main__":
    main()