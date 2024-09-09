import path from "path";

import { getConfig } from "./config";

import {
  files,
  mapBasePaths,
  mapFullPaths,
  readMappedJson,
  mapJsonToObject,
  inspect,
} from "./core";

import { log, logByValidateConfig, logByResult } from "./utils";

(async function () {
  const config = await getConfig();

  if (!config) {
    log("ERROR", "You need a config file");
    throw new Error('Could not find "i18next-key-inspector.config.json" file.');
  }

  const logByConfig = logByValidateConfig(config);

  if (logByConfig.logType === "ERROR") {
    log(logByConfig.logType, logByConfig.message ?? "");
    throw new Error(logByConfig.message);
  }

  const { basePath, source, locales } = config;
  const root = process.cwd();
  const filePath = path.resolve(root, `${basePath}/${source}`);

  const result = await inspect(
    mapJsonToObject(
      readMappedJson(
        mapFullPaths(
          mapBasePaths(basePath, source, [...locales]),
          await files(filePath)
        )
      )
    )
  );

  const { logType, message } = logByResult(result);

  if (logType === "SUCCESS") {
    log(logType, message);
    return;
  }

  if (logType === "ERROR") {
    log(logType, message);
    throw new Error(message);
  }
})();
