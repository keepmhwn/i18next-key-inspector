const path = require("path");

const { getConfig } = require("./config");

const {
  mapPaths,
  localeFileList,
  readMappedJson,
  mapJsonToObject,
  inspect,
} = require("./core");

async function main() {
  const config = await getConfig();

  if (!config) {
    console.log("You need a config file");
    return;
  }

  const { basePath, source, locales } = config;

  if (!basePath) {
    return;
  }

  if (!source) {
    return;
  }

  if (!locales) {
    return;
  }

  const root = process.cwd();
  const filePath = path.resolve(root, `${basePath}/${source}`);

  const result = await inspect(
    mapJsonToObject(
      readMappedJson(
        mapPaths({
          basePath,
          source,
          locales,
          files: localeFileList(filePath),
        })
      )
    )
  );

  console.log(result);
}

main();
