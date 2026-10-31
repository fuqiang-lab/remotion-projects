import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";

/**
 * 本片的视觉语言 = styles/editorial-light 的设计令牌。
 * 为保证本 Composition 不依赖风格库之外的样式，这里只做「取用」，
 * 色值 / 字号 / 动效曲线均与 styles/editorial-light/theme.ts 保持一致，
 * 改风格时请两边同步（以风格库为准）。
 */
export const C = {
  paper: "#F4F3F8",
  paper2: "#EDEBF2",
  ink: "#22252D",
  ink2: "#3A3F4B",
  muted: "#8C8FA0",
  /**
   * 卡片内小字号正文（13–14px）用的次级深色：风格库 muted 定位是「说明文字」，
   * 放在 13px 的说明行上会偏浅，读起来吃力；这里用同一色相、深两档的取值，
   * 只用于正文，不用于眉标/序号等装饰性文字。
   */
  body2: "#5F6475",
  line: "#E2E0E7",
  accent: "#E06C3C",
  accentSoft: "#FBE7DC",
  accentLine: "#EFBBA2",
  blue: "#4C74E0",
  blueSoft: "#E4ECFB",
  blueLine: "#B9CAF1",
  green: "#2E9E6A",
  greenSoft: "#E1F1E8",
  greenLine: "#AFDCC5",
  purple: "#7A5BD6",
  purpleSoft: "#EEE8FB",
  purpleLine: "#CBBDF0",
  card: "#FFFFFF",
  pill: "#343C4A",
  plane: "#CFE3F8",
  planeEdge: "#AFCDEA",
} as const;

export const F = {
  sans: `"Inter", "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif`,
  mono: `"JetBrains Mono", "Cascadia Mono", Consolas, monospace`,
} as const;

loadNotoSansSC("normal", { weights: ["400", "500", "700", "900"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
loadJetBrainsMono("normal", { weights: ["400", "500"], subsets: ["latin"] });