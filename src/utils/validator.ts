import { log } from "./log";

export const validateConfig = (config: Config) => {
  const { basePath, source, locales } = config;

  if (!basePath) {
    log("ERROR", `You need to set "basePath" in your config file.`);
    return false;
  }

  if (!source) {
    log("ERROR", `You need to set "source" in your config file.`);
    return false;
  }

  if (!locales) {
    log("ERROR", `You need to set "locales" in your config file.`);
    return false;
  }

  return true;
};

export const validateResult = (result: Success | Fail) => {
  if (result.type === "SUCCESS") {
    log("SUCCESS", "Congratulations!!! All locale files have matching keys.");
    return;
  }

  if (
    result.cause.sourcePath === undefined &&
    result.cause.targetPath === undefined
  ) {
    log("ERROR", "There is a file that does not match the format.");
    return;
  }

  if (
    result.cause.sourcePath !== undefined ||
    result.cause.targetPath === undefined
  ) {
    log(
      "ERROR",
      `No file matching "${result.cause.sourcePath}" found in other locales.`
    );
    return;
  }

  if (
    result.cause.sourcePath === undefined ||
    result.cause.targetPath !== undefined
  ) {
    log(
      "ERROR",
      `The file "${result.cause.targetPath}" is not found in the source locale.`
    );
    return;
  }

  log(
    "ERROR",
    `The keys in files "${result.cause.sourcePath}" and "${result.cause.targetPath}" do not match.`
  );
};
