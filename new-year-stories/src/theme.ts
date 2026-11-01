import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

export const display = "Cinzel"; // latin + digits only
export const serif = "Cormorant Garamond"; // has Cyrillic

loadFont({ family: display, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: serif, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });

export const GOLD = "#d4ad6e";
export const GOLD_LIGHT = "#f3dca8";
export const GOLD_DARK = "#8a6a36";
export const IVORY = "#f4eee4";
export const BERRY = "#7d1626";
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const GOLD_TEXT: React.CSSProperties = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, ${GOLD_DARK} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const ease = Easing.bezier(0.33, 0, 0.2, 1);
