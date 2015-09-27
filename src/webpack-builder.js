import R from "ramda";
import webpack from "webpack";
import fs from "fs-extra";
import fsPath from "path";

export const BUILD_PATH = fsPath.resolve("./.build/webpack");
const NODE_MODULES_PATH = fsPath.join(__dirname, "../node_modules");
const modulePath = (path) =>  { return fsPath.join(NODE_MODULES_PATH, path); };


const SETTINGS = {
  resolveLoader: { fallback: NODE_MODULES_PATH },
  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ["", ".js", ".jsx", "json"],
    alias: {
      "react": modulePath("react"),
      "lodash": modulePath("lodash"),
      "ramda": modulePath("ramda")
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


const getSettings = (entry, output, options = {}) => {
    const config = R.merge(R.clone(SETTINGS), {
      entry,
      output: {
        filename: fsPath.basename(output),
        path: fsPath.dirname(output)
      }
    });
    if (options.minify) {
      config.plugins = [ new webpack.optimize.UglifyJsPlugin({ minimize: true }) ];
    }
    return config;
};



const compile = (entryPath, outputPath, options) => {
    const config = getSettings(entryPath, outputPath, options);
    return new Promise((resolve, reject) => {
        webpack(config, (err, result) => {
          if (err) {
            reject(err)
          } else {
            const elapsed = result.endTime - result.startTime;
            const stats = fs.lstatSync(outputPath);
            resolve({ elapsed, fileSize: stats.size })
          }
        });
    });

};


export default (paths, routes, options) => {

  // Build the list of paths to compile.
  const items = [];
  const add = (entry, outputFile) => {
        items.push({
          entry,
          output: `${ BUILD_PATH }/${ outputFile }`
        })
      };
  add(`${ paths.js }/index.js`, "base.js");
  R.values(routes).map(item => {
        const entry = `${ paths.pages }/${ item.page }/${ item.entry || "entry.js" }`;
        if (fs.existsSync(entry)) {
          add(entry, `pages/${ item.page }.js`);
        }
      });

  return new Promise((resolve, reject) => {
      // Run each item through the webpack compiler.
      const response = { files: [] }
      const compileItem = (index) => {
            if (index < items.length) {
              const item = items[index];
              if (fs.existsSync(item.entry)) {
                compile(item.entry, item.output, options)
                .then(result => {
                      response.files.push({
                        path: item.entry.replace(paths.base, ""),
                        elapsed: result.elapsed,
                        fileSize: result.fileSize
                      })
                      compileItem(index + 1); // <== RECURSION.
                })
                .catch(err => reject(err));
              }
            } else {
              // Complete.
              const sumElapsed = (result, item) => result + item.elapsed;
              response.elapsed = R.reduce(sumElapsed, 0, response.files);
              resolve(response);
            }
          };
      compileItem(0);
  });
};
