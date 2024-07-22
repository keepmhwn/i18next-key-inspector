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
