import _ from "lodash";
import express from "express";
import css from "./middleware-css";
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
 */
const api = (options = {}) => {
  const router = express.Router();
  router.paths = middlewarePaths(options);
  router.templates = templates(router.paths);
  middlewareRouter(router);
  css(router);
  return router;
};


/**
 * Starts a web server.
 * @param {options}
 *            - port: The port to run on (default 80:production | 8080:development).
 *            - name: The display name of the server (emitted to the console).
 *            - <see main middlware options>
 */
api.start = (options = {}) => {
  const PORT = options.port || IS_PRODUCTION ? 80 : 8080;
  const NAME = options.name || "Server"

  // Create the server.
  const app = express();
  app.use(api(options));

  // Start the server.
  app.listen(PORT, () => {
          const HR = _.repeat("-", 80)
          console.log("\n");
          console.log(`${ NAME }:`);
          console.log(HR);
          console.log(" - port:", PORT);
          console.log(" - env: ", process.env.NODE_ENV || "development");
          console.log("");
  });
};



export default api;
