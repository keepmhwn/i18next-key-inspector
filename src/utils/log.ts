const LOG_COLOR_CMD: { [key in LogColorType]: string } = {
  RESET: "\x1b[0m",
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
};

export const log = (type: LogType, message: string) => {
  const defaultLog = (...args: string[]) => {
    console.log("[i18next-key-inspector]", ...args);
  };

  if (type === "ERROR") {
    defaultLog(LOG_COLOR_CMD.RED, message, LOG_COLOR_CMD.RESET);
    return;
  }

  if (type === "SUCCESS") {
    defaultLog(LOG_COLOR_CMD.GREEN, message, LOG_COLOR_CMD.RESET);
    return;
  }

  defaultLog(message);
};

export const logByValidateConfig = (
  config: Config
): { logType: LogType; message?: string } => {
  const { basePath, source, locales } = config;

  if (!basePath) {
    return {
      logType: "ERROR",
      message: 'You need to set "basePath" in your config file.',
    };
  }

  if (!source) {
    return {
      logType: "ERROR",
      message: 'You need to set "source" in your config file.',
    };
  }

  if (!locales) {
    return {
      logType: "ERROR",
      message: 'You need to set "locales" in your config file.',
    };
  }

  return {
    logType: "SUCCESS",
  };
};

export const logByResult = (
  result: Success | Fail
): { logType: LogType; message: string } => {
  if (result.type === "SUCCESS") {
    return {
      logType: "SUCCESS",
      message: "Congratulations!!! All locale files have matching keys.",
    };
  }

  if (
    result.cause.sourcePath === undefined &&
    result.cause.targetPath === undefined
  ) {
    return {
      logType: "ERROR",
      message: "There is a file that does not match the format.",
    };
  }

  if (
    result.cause.sourcePath !== undefined ||
    result.cause.targetPath === undefined
  ) {
    return {
      logType: "ERROR",
      message: `No file matching "${result.cause.sourcePath}" found in other locales.`,
    };
  }

  if (
    result.cause.sourcePath === undefined ||
    result.cause.targetPath !== undefined
  ) {
    return {
      logType: "ERROR",
      message: `The file "${result.cause.targetPath}" is not found in the source locale.`,
    };
  }

  return {
    logType: "ERROR",
    message: `The keys in files "${result.cause.sourcePath}" and "${result.cause.targetPath}" do not match.`,
  };
};
