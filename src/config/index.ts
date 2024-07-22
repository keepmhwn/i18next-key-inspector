import path from "path";
import { existsSync, readFileSync } from "fs";

const CONFIG_FILE_NAME = "i18next-key-inspector.config.json";

export function getConfig(): Config | undefined {
  const root = process.cwd();
  const configFilePath = path.resolve(root, CONFIG_FILE_NAME);

  return existsSync(configFilePath)
    ? JSON.parse(String(readFileSync(configFilePath)))
    : undefined;
}
