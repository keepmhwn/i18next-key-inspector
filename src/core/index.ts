const path = require("path");
const fs = require("fs/promises");
const { existsSync } = require("fs");

type Path = string | undefined;

type MapPathsFuncParams = {
  basePath: string;
  source: string;
  locales: string[];
  files: string[];
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

export async function* localeFileList(path: string): AsyncGenerator<string> {
  if (!existsSync(path)) {
    return;
  }

  const files = await fs.readdir(path);
  for (const file of files) {
    yield file;
  }

  return;
}

export async function* mapPaths(
  params: MapPathsFuncParams
): AsyncGenerator<MappedPath> {
  const root = process.cwd();
  const { basePath, source, locales, files } = params;

  for (const locale of locales) {
    for await (const file of files) {
      const sourcePath = path.resolve(root, `${basePath}/${source}/${file}`);
      const targetPath = path.resolve(root, `${basePath}/${locale}/${file}`);

      yield {
        sourcePath: existsSync(sourcePath) ? sourcePath : undefined,
        targetPath: existsSync(targetPath) ? targetPath : undefined,
      };
    }
  }
}

export async function* readMappedJson(
  paths: AsyncGenerator<MappedPath>
): AsyncGenerator<MappedJson> {
  for await (const { sourcePath, targetPath } of paths) {
    if (sourcePath === undefined || targetPath === undefined) {
      const result: MappedJson = {
        source: {
          path: sourcePath,
          json: sourcePath ? await fs.readFile(sourcePath, "utf-8") : undefined,
        },
        target: {
          path: targetPath,
          json: targetPath ? await fs.readFile(targetPath, "utf-8") : undefined,
        },
      };
      yield result;
    }

    const sourceJson = await fs.readFile(sourcePath, "utf-8");
    const targetJson = await fs.readFile(targetPath, "utf-8");

    yield {
      source: { path: sourcePath, json: sourceJson },
      target: { path: targetPath, json: targetJson },
    };
  }

  return;
}

export async function* mapJsonToObject(
  mappedJsonList: AsyncGenerator<MappedJson>
): AsyncGenerator<MappedLocaleObj> {
  for await (const { source, target } of mappedJsonList) {
    yield {
      source: {
        path: source.path,
        data:
          typeof source.json === "string" ? JSON.parse(source.json) : undefined,
      },
      target: {
        path: target.path,
        data:
          typeof target.json === "string" ? JSON.parse(target.json) : undefined,
      },
    };
  }

  return;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compareKey(source: any, target: any) {
  if (typeof source !== typeof target) {
    return false;
  }

  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === "object" &&
      typeof target[key] === "object" &&
      !compareKey(source[key], target[key])
    ) {
      return false;
    }

    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      return false;
    }
  }

  return true;
}

export async function inspect(
  mappedLocaleObjList: AsyncGenerator<MappedLocaleObj>
): Promise<Success | Fail> {
  for await (const { source, target } of mappedLocaleObjList) {
    if (
      source.path === undefined ||
      source.data === undefined ||
      target.path === undefined ||
      target.data === undefined
    ) {
      return {
        type: "FAIL",
        cause: {
          sourcePath: source.path,
          targetPath: target.path,
        },
      };
    }

    const isMatching = compareKey(source.data, target.data);

    if (isMatching === false) {
      return {
        type: "FAIL",
        cause: {
          sourcePath: source.path,
          targetPath: target.path,
        },
      };
    }
  }

  return {
    type: "SUCCESS",
  };
}
