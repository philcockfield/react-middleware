import R from "ramda";
import Promise from "bluebird";
import webpack from "webpack";
import fs from "fs-extra";
import fsPath from "path";

export const BUILD_PATH = fsPath.resolve("./.build/webpack");
const NODE_MODULES_PATH = fsPath.resolve("./node_modules");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const modulePath = (path) => { return fsPath.join(NODE_MODULES_PATH, path); };


const SETTINGS = {
  resolveLoader: { fallback: NODE_MODULES_PATH },
  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ["", ".js", ".jsx", "json"],
    alias: {
      "react": modulePath("react"),
      "ramda": modulePath("ramda")
    }
  },
  module: {
    loaders: [
      // ES6/JSX.
      { test: /\.js$/, exclude: /(node_modules)/, loader: "babel" },
      { test: /\.jsx$/, exclude: /(node_modules)/, loader: "babel" },
      { test: /\.json$/, loader: "json" }
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
    if (options.loaders) {
      config.module.loaders = options.loaders;
    }
    return config;
};



const shortenError = (error) => {
  if (error.name === "ModuleBuildError") {
    const index = error.message.indexOf("    at ");
    if (index > -1) {
      error.message = error.message.substr(0, index);
    }
  }
};



const compile = (entryPath, outputPath, loaders) => {
    const minify = IS_PRODUCTION;
    const config = getSettings(entryPath, outputPath, { minify, loaders });
    return new Promise((resolve, reject) => {
        webpack(config, (err, result) => {
            if (err) {
              reject({ errors: [ err ] });
            } else {
              const errors = result.compilation.errors;
              if (errors.length > 0) {
                errors.forEach(error => shortenError(error));
                reject({ errors });
              } else {
                const elapsed = result.endTime - result.startTime;
                const stats = fs.lstatSync(outputPath);
                resolve({ elapsed, fileSize: stats.size });
              }
            }
        });
    });

};



/**
 * Builder API.
 * @param {Object} settings:
 *            - paths:          {Object} of paths to known folders.
 *            - routes:         {Object} of routes.
 *            - loaders:        {Array} of webpack loaders to use.
 *                              Default loaders are replaced with this array.
 *
 */
export default (settings = {}) => {
  const { paths, routes } = settings;

  // Build the list of paths to compile.
  const items = [];
  const add = (entry, outputFile) => {
        items.push({
          entry,
          output: `${ BUILD_PATH }/${ outputFile }`
        });
      };
  add(`${ paths.scripts }/index.js`, "base.js");
  R.values(routes).map(item => {
        const entry = `${ paths.pages }/${ item.page }/${ item.entry || "entry.js" }`;
        if (fs.existsSync(entry)) {
          add(entry, `pages/${ item.page }.js`);
        }
      });

  return new Promise((resolve, reject) => {
      // Run each item through the webpack compiler.
      const response = { files: [] };
      const compileItem = (index) => {
            if (index < items.length) {
              const item = items[index];
              if (fs.existsSync(item.entry)) {
                compile(item.entry, item.output, settings.loaders)
                .then(result => {
                      response.files.push({
                        path: item.entry.replace(paths.base, ""),
                        elapsed: result.elapsed,
                        fileSize: result.fileSize
                      });
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
