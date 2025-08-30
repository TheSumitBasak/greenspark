const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./build/app.js", // compiled JS from tsc
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node", // or 'web' if browser
  mode: "production",
  // externals: [nodeExternals()], // ignore node_modules in bundling
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // exclude from transpiling
        use: {
          loader: "babel-loader", // if needed
        },
      },
    ],
  },
  stats: {
    warnings: false, // Disables all warnings in stats output
  },
};
