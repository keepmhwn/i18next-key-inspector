type Path = string | undefined;

type LogType = "NORMAL" | "SUCCESS" | "ERROR";
type LogColorType = "RESET" | "GREEN" | "RED";

type Config = {
  basePath: string;
  source: string;
  locales: string | string[];
};

type MappedPath = {
  sourcePath: Path;
  targetPath: Path;
};

type MappedJson = {
  source: {
    path: Path;
    json: string | undefined;
  };
  target: {
    path: Path;
    json: string | undefined;
  };
};

type MappedLocaleObj = {
  source: {
    path: Path;
    data: object | undefined;
  };
  target: {
    path: Path;
    data: object | undefined;
  };
};

type Success = {
  type: "SUCCESS";
};

type Fail = {
  type: "FAIL";
  cause: {
    sourcePath: Path;
    targetPath: Path;
  };
};
