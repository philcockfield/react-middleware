import R from "ramda";
var webpack = require("webpack");
var fsPath = require("path");

const NODE_MODULES_PATH = fsPath.join(__dirname, "../node_modules");
function modulePath(path) { return fsPath.join(NODE_MODULES_PATH, path); };


const SETTINGS = {
  resolveLoader: { fallback: NODE_MODULES_PATH },
  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ["", ".js", ".jsx", "json"],
    alias: {
      "react": modulePath("react"),
      "lodash": modulePath("lodash")
    }
  },

  module: {
    loaders: [
      // ES6/JSX.
      { test: /\.js$/,  exclude: /(node_modules)/, loader: "babel-loader" },
      { test: /\.jsx$/, exclude: /(node_modules)/, loader: "babel-loader" },
      { test: /\.json$/, loader: "json-loader" },
    ]
  }
};


const BASE = {
  entry: "./views/js",
  output: {
    filename: "base.js",
    path: "./public/js"
  }
};




// ----------------------------------------------------------------------------


const getConfiguration = function(config, options) {
  console.log("get config");
  // console.log("R.clone", R.clone);
  options = options || {};
  config = R.merge(R.clone(SETTINGS), R.clone(config));
  if (options.minify) {
    config.plugins = [ new webpack.optimize.UglifyJsPlugin({ minimize: true }) ];
  }
  return config;
};


module.exports = {
  base: function(options) { return getConfiguration(BASE, options) },
};
