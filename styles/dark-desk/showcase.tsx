import { Desk } from "./ui";
import { C, F } from "./theme";

export * from "./theme";
export * from "./ui";

/**
 * Dark Desk 风格样本：Studio 里直接看，用来核对版式与色值。
 * 正式作品请勿复制这里的样式常量，统一引用 theme.ts / ui.tsx。
 */
export const DarkDeskShowcase: React.FC = () => (
  <Desk>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        fontFamily: F.sans,
      }}
    >
      <div style={{ fontSize: 13, letterSpacing: 4, color: C.accent, fontWeight: 800 }}>
        DARK DESK · 风格样本
      </div>
      <div style={{ fontSize: 52, fontWeight: 900, color: C.fg }}>
        暗色桌面 + <span style={{ color: C.accent }}>橘色强调</span>
      </div>
      <div style={{ fontSize: 15, color: C.muted }}>卡片 #222127 · 斜线 #F5F3EF · 胶囊 #0E0D10</div>
    </div>
  </Desk>
);