import R from "ramda";
import _ from "lodash";
import chalk from "chalk";
import express from "express";
import compression from "compression";
import css from "file-system-css";
import middlewarePaths from "./paths";
import routerCss from "./router-css";
import routerHtml from "./router-html";
import routerJs from "./router-js";
import webpackBuilder from "./webpack-builder";
import templatesFiles from "./templates";
import * as util from "./util";

const IS_PRODUCTION = process.env.NODE_ENV === "production";



const buildFunction = (middleware, paths, routes) => {
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
 *            - data:       An {Object} or {Function} to pass as the root data object to the React page(s).
 *                          If a function is passed, details about the URL and rendering page are passed
 *                          as an argument.
 *                          This is useful as an API hook when creating a `react-middleware` package
 *                          to be shared as a module.
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
  middleware.use(express.static(paths.public, { maxage: "60 days" }))
  routerHtml(middleware, paths, routes, options.data);
  routerCss(middleware, paths, { watch });
  routerJs(middleware, routes);
  if (IS_PRODUCTION) {
    middleware.use(compression());
  }

  // Decorate with functions.
  middleware.start = (startOptions) => api.start(express(), middleware, startOptions);
  middleware.clearCache = () => api.clearCache();
  middleware.build = buildFunction(middleware, paths, routes);

  // Finish up.
  return middleware;
};



/**
 * Starts a web server.
 * @param {function} app: The express instance (eg. app = express();)
 *                        If not specified a new express instance is created.
 * @param {function} middleware: The react-middleware instance to use.
 * @param {options}
 *            - port:   The port to run on.
 *            - name:   The display name of the server (emitted to the console).
 *            - silent: Flag indicating if startup output should be suppressed.
 * @return Promise.
 */
api.start = (app, middleware, options = {}) => {
  // Ensure required parameters were passed.
  if (!R.is(Function, app)) { throw new Error(`Start Method: An express instance must be specified.`); }
  if (!R.is(Function, middleware)) { throw new Error(`Start Method: The [react-middleware] instance must be specified.`); }

  // Extract startup values.
  if (R.is(Number, options)) { options = { port: options }; }
  const PORT = options.port || (IS_PRODUCTION ? 80 : 3030);
  const NAME = options.name || "Server"
  const SILENT = options.silent === undefined ? false : options.silent;

  const logStarted = (js) => {
        console.log("");
        console.log(chalk.green(`${ NAME }:`));
        console.log(chalk.grey(" - port:"), PORT);
        console.log(chalk.grey(" - env: "), process.env.NODE_ENV || "development");
        if (js.files.length > 0) {
          console.log(chalk.grey(" - js:  "), `${ (js.elapsed / 1000).toPrecision(1) } second build time`);
          js.files.forEach(item => {
              console.log(chalk.grey(`         - ${ item.path },`), util.fileSize(item.fileSize));
          });
        }
        console.log("");
      };

  return new Promise((resolve, reject) => {
      // Build the javascript (webpack).
      console.log(chalk.grey("Starting..."));
      middleware.build()
      .then(js => {

        // Configure and start the express server.
        app
          .use(middleware)
          .listen(PORT, () => {
                if (!SILENT) { logStarted(js); }
                resolve();
          });

      })
      .catch(err => {
        console.log("err", err);
      });
  });
};



/**
 * Initalizes the default folder/template structure.
 * @param {string} path:  The base-path. Use "./" to create
 *                        relative to the root of the host module.
 */
api.init = (path) => {
  if (!R.is(String, path)) { path = "./site"; }
  api({ base: path }).templates.createSync();
  return api;
};



/**
 * Clears all cached content.
 */
api.clearCache = () => {
  css.delete();
  return api;
};



// ----------------------------------------------------------------------------
export default api;
