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

import { log, validateConfig, validateResult } from "./utils";

(async function () {
  const config = await getConfig();

  if (!config) {
    log("ERROR", "You need a config file");
    return;
  }

  if (validateConfig(config) === undefined) {
    return;
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

  validateResult(result);
})();
