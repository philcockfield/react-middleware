import _ from "lodash";
import express from "express";
import fsCss from "fs-css";
import middlewareCss from "./middleware-css";
import middlewarePaths from "./middleware-paths";
import middlewareRouter from "./middleware-router";
import templates from "./templates";

const IS_PRODUCTION = process.env.NODE_ENV === "production";


/**
 * Returns the server middleware.
 * @param options:
 *            - base:       The relative or absolute path to the base for all other relative paths.
 *            - css:        The relative or absolute path to the global CSS folder.
 *            - public:     The relative or absolute path to the public assets folder.
 *            - layouts:    The relative or absolute path to the page layouts folder.
 *            - components: The relative or absolute path to the shared components folder.
 *            - pages:      The relative or absolute path to the pages folder.
 *            - css:
 *                - minify: Flag indicating if compiled CSS should be compressed.
 *                          True by default when in "production".
 *                - watch:  Flag indicating if changes to CSS files should invalidate the cache.
 *                          True by default when not in "production".
 */
const api = (options = {}) => {
  // Prepare the middleware.
  const middleware = express.Router();
  middleware.paths = middlewarePaths(options);
  middleware.templates = templates(middleware.paths);
  middlewareRouter(middleware);
  middlewareCss(middleware, options.css);

  // Decorate with functions.
  middleware.start = (options) => start(middleware, options);
  middleware.clearCache = () => api.clearCache();

  // Finish up.
  return middleware;
};



const start = (middlware, options = {}) => {
  const PORT = options.port || IS_PRODUCTION ? 80 : 8080;
  const NAME = options.name || "Server"
  const SILENT = options.silent === undefined ? false : options.silent;
  express()
    .use(middlware)
    .listen(PORT, () => {
          if (!SILENT) {
            const HR = _.repeat("-", 80)
            console.log("\n");
            console.log(`${ NAME }:`);
            console.log(HR);
            console.log(" - port:", PORT);
            console.log(" - env: ", process.env.NODE_ENV || "development");
            console.log("");
          }
    });
  return middlware;
};


/**
 * Starts a web server.
 * @param {options}
 *            - port:   The port to run on (default 80:production | 8080:development).
 *            - name:   The display name of the server (emitted to the console).
 *            - silent: Flag indicating if startup output should be suppressed.

 *            - <see main middlware options>
 */
api.start = (options = {}) => start(api(options), options);


/**
 * Clears all cached content.
 */
api.clearCache = () => {
  fsCss.clearCache();
};

// ----------------------------------------------------------------------------
export default api;
