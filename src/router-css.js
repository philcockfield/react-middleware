import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import css from "file-system-css";

let NODE_ENV = process.env.NODE_ENV;
const IS_PRODUCTION = NODE_ENV === "production";

const RESET_NAMES = ["normalize.css", "reset.css"];
const isCssReset = (path) => _.any(RESET_NAMES, name => _.endsWith(path, name));

export const getOptions = (options = {}) => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
      cache: true,
      pathsRequired: false,
      watch: options.watch === undefined ? !isProduction : options.watch,
      minify: options.minify === undefined ? isProduction : options.minify
    };
  };

const isMixin = (path) => {
    const name = fsPath.basename(path, ".styl");
    if (name === "mixin") { return true; }
    if (_.endsWith(name, ".mixin")) { return true; }
    return false;
  };



export default (middleware, paths, options = {}) => {
  options = getOptions(options);

  // Bail out if the /css folder does not exist.
  if (!fs.existsSync(paths.css)) { return; }

  // Determine whether a CSS reset file exists within /css.
  const globalCssPaths = _.map(fs.readdirSync(paths.css), path => fsPath.join(`${ paths.css }/${ path }`));
  const globalMixinPaths = _.filter(globalCssPaths, isMixin);
  const cssResetPath = _.chain(globalCssPaths)
        .filter(isCssReset)
        .map(fileName => fsPath.join(paths.css, fileName))
        .value();

  const toSourcePath = (key, value) => {
        const expandPaths = (base, value) => {
          return _.chain(value)
                  .split(",")
                  .map(folder => `${ base }/${ _.trim(folder) }`)
                  .value();
        };

        const path = paths[key];
        switch (key) {
          case "global": return [ cssResetPath, paths.css ];

          case "layouts": return paths.layouts;
          case "layout": return expandPaths(paths.layouts, value);

          case "pages": return paths.pages;
          case "page": return expandPaths(paths.pages, value);

          case "components": return paths.components;
          case "component": return expandPaths(paths.components, value);
        }
  };

  const queryToSourcePaths = (query) => {
      // Process the query-string converting it into a set
      // of paths that point to the source CSS files.
      query = _.clone(query);
      query = _.isEmpty(query)
          ? { global: true, pages: true, components: true, layouts: true }
          : query;

      return _.chain(query)
          .keys()
          .map(key => toSourcePath(key, query[key]))
          .flatten(true)
          .compact()
          .value();
  };


  // Render the CSS response.
  const render = (req, res, sourcePaths = []) => {
        // Prep the source paths.
        if (!_.isArray(sourcePaths)) { sourcePaths = [sourcePaths]; }
        sourcePaths = _.flatten(sourcePaths, true);
        if (sourcePaths.length === 0) {
          return res.status(404).send({ message: `No CSS paths to load.` })
        }

        // Compile the CSS (or retrieve from cache).
        css.compile([globalMixinPaths, sourcePaths], options)
        .then(result => {
              const css = result.css;
              if (_.isString(css)) {
                res.set("Content-Type", "text/css");
                res.send(css);
              } else {
                res.status(404).send({ message: `No CSS at ${ req.url }` });
              }
        })
        .catch(err => res.status(500).send({
              error: `Failed to compile CSS for ${ req.url }`,
              message: err.message,
              paths: sourcePaths
        }))
  };

  const renderGroup = (req, res, keys = []) => {
      const query = {};
      _.forEach(keys, key => query[key] = true);
      render(req, res, queryToSourcePaths(query));
  };

  const renderSpecific = (req, res, key) => {
      const query = { [key]: req.params.name };
      render(req, res, queryToSourcePaths(query));
  };

  // Listen to GET requests for CSS.
  middleware.get("/css", (req, res) => render(req, res, queryToSourcePaths(req.query)));
  middleware.get("/css/common", (req, res) => renderGroup(req, res, ["global", "layouts", "components"]));
  middleware.get("/css/global", (req, res) => renderGroup(req, res, ["global"]));

  middleware.get("/css/pages", (req, res) => renderGroup(req, res, ["pages"]));
  middleware.get("/css/page/:name", (req, res) => renderSpecific(req, res, "page"));

  middleware.get("/css/layouts", (req, res) => renderGroup(req, res, ["layouts"]));
  middleware.get("/css/layout/:name", (req, res) => renderSpecific(req, res, "layout"));

  middleware.get("/css/components", (req, res) => renderGroup(req, res, ["components"]));
  middleware.get("/css/component/:name", (req, res) => renderSpecific(req, res, "component"));
};
