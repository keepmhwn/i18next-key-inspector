import path from "path";

export default {
  target: "node",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve("dist"),
    library: {
      type: "module",
    },
    module: true,
    chunkFormat: "module",
  },
  experiments: {
    outputModule: true,
  },
};
