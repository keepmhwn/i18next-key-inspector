const path = require("path");
const { existsSync, readFileSync } = require("fs");

type Config = {
  basePath: string;
  source: string;
  locales: string[];
};

export function getConfig(): Config | undefined {
  const root = process.cwd();
  const configFilePath = path.resolve(
    root,
    "i18next-key-inspector.config.json"
  );

  return existsSync(configFilePath)
    ? JSON.parse(readFileSync(configFilePath))
    : undefined;
}
