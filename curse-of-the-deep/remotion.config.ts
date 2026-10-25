import { Config } from "@remotion/cli/config";
import { existsSync, readdirSync } from "node:fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// In Claude cloud sessions Remotion can't download its own browser, so use the pre-installed one
const shellDir = "/opt/pw-browsers";
if (existsSync(shellDir)) {
  const dir = readdirSync(shellDir).find((d) => d.startsWith("chromium_headless_shell"));
  if (dir) {
    const sub = readdirSync(`${shellDir}/${dir}`)[0];
    Config.setBrowserExecutable(`${shellDir}/${dir}/${sub}/chrome-headless-shell`);
  }
}
