import R from "ramda";
import _ from "lodash";
import chalk from "chalk";
import express from "express";
import css from "file-system-css";
import middlewarePaths from "./paths";
import routerCss from "./router-css";
import routerHtml from "./router-html";
import routerJs from "./router-js";
import webpackBuilder from "./webpack-builder";
import templatesFiles from "./templates";
import * as util from "./util";

const IS_PRODUCTION = process.env.NODE_ENV === "production";



const start = (middleware, options = {}) => {
  const PORT = options.port || IS_PRODUCTION ? 80 : 8080;
  const NAME = options.name || "Server"
  const SILENT = options.silent === undefined ? false : options.silent;

  // Build the javascript (webpack).
  console.log(chalk.grey("Starting..."));
  middleware.build()
  .then(js => {

    // Start the express server.
    express()
      .use(middleware)
      .listen(PORT, () => {
            if (!SILENT) {
              const HR = _.repeat("-", 80)
              console.log("\n");
              console.log(`${ NAME }:`);
              console.log(chalk.grey(HR));
              console.log(" - port:", chalk.cyan(PORT));
              console.log(" - env: ", process.env.NODE_ENV || "development");
              if (js.files.length > 0) {
                console.log(" - js:  ", `${ (js.elapsed / 1000).toPrecision(1) } sec build time`);
                js.files.forEach(item => {
                    console.log(chalk.cyan(`         - ${ item.path },`), util.fileSize(item.fileSize));
                });
              }
              console.log("");
            }
      });

  });

  return middleware;
};



const build = (middleware, paths, routes) => {
  let builtResponse;
  return (options = {}) => {
    return new Promise((resolve, reject) => {
        if (builtResponse && options.force !== true) {
          // Don't rebuild if compilation has already occured.
          resolve(builtResponse);
        } else {
          webpackBuilder(paths, routes)
          .then(result => {
              builtResponse = result;
              resolve(result);
          })
          .catch(err => {
              // Failed to build.
              if (err.errors) {
                console.error(chalk.red("FAILED to compile javascript.\n"))
                err.errors.forEach(error => console.error(error.message));
              }
              reject(err)
          })
        }
    });
  }
};




/**
 * Returns the server middleware.
 * @param options:
 *            - base:       The relative or absolute path to the base for all other relative paths.
 *            - css:        The relative or absolute path to the global CSS folder.
 *            - public:     The relative or absolute path to the public assets folder.
 *            - layouts:    The relative or absolute path to the page layouts folder.
 *            - components: The relative or absolute path to the shared components folder.
 *            - pages:      The relative or absolute path to the pages folder.
 *            - watch:      Flag indicating if changes to files should invalidate the cache.
 *                          True by default when not in "production".
 */
const api = (options = {}) => {
  // Setup initial conditions.
  const watch = R.is(Boolean, options.watch) ? options.watch : !IS_PRODUCTION;

  // Prepare the middleware.
  const middleware = express.Router();
  const paths = middleware.paths = middlewarePaths(options);
  const templates = middleware.templates = templatesFiles(middleware.paths);
  const routes = templates.routes.import();

  routerHtml(middleware, paths, routes);
  routerCss(middleware, paths, { watch });
  routerJs(middleware, routes);

  // Decorate with functions.
  middleware.start = (options) => start(middleware, options);
  middleware.init = (options) => { templates.create(); middleware.start(options); }
  middleware.clearCache = () => api.clearCache();
  middleware.build = build(middleware, paths, routes);

  // Finish up.
  return middleware;
};



/**
 * Starts a web server.
 * @param {options}
 *            - port:   The port to run on (default 80:production | 8080:development).
 *            - name:   The display name of the server (emitted to the console).
 *            - silent: Flag indicating if startup output should be suppressed.

 *            - <see main middleware options>
 */
api.start = (options = {}) => start(api(options), options);


/**
 * Clears all cached content.
 */
api.clearCache = () => {
  css.delete();
};

// ----------------------------------------------------------------------------
export default api;
