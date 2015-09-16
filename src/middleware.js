import _ from "lodash";
import express from "express";
import css from "./middleware-css";
import paths from "./middleware-paths";
import router from "./middleware-router";
import templates from "./templates";


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
export default (options = {}) => {
  const middleware = express.Router();
  middleware.paths = paths(options);
  middleware.templates = templates(middleware.paths);
  router(middleware);
  css(middleware);
  return middleware;
};
