import R from "ramda";
var webpack = require("webpack");
var fsPath = require("path");

const NODE_MODULES_PATH = fsPath.join(__dirname, "../node_modules");
const modulePath = (path) =>  { return fsPath.join(NODE_MODULES_PATH, path); };


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



// ----------------------------------------------------------------------------


export default (middleware) => {
  const { paths } = middleware;


  const BASE = {
    entry: paths.js,
    output: {
      filename: "base.js",
      path: `${ paths.public }/js`
    }
  };


  const settings = getConfiguration(BASE);
  // webpack(settings, (err, result) => {
  //   console.log("err", err);
  //   console.log("result", result);
  // })



  middleware.get("/js", (req, res) => {

    const path = `${ paths.public }/js/base.js`;
    console.log("path", path);
    res.sendFile(path);






  });
};
