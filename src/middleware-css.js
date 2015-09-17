import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import fsCss from "fs-css";

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




export default (middleware, options = {}) => {
  const { paths, templates } = middleware;
  options = getOptions(options);

  // Bail out if the /css folder does not exist.
  if (!fs.existsSync(paths.css)) { return; }

  // Determine whether a CSS reset file exists within /css.
  let cssResetPath = _.chain(fs.readdirSync(paths.css))
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



  // Render the CSS response.
  const render = (req, res, sourcePaths = []) => {
        // Prep the source paths.
        if (!_.isArray(sourcePaths)) { sourcePaths = [sourcePaths]; }
        sourcePaths = _.flatten(sourcePaths, true);
        if (sourcePaths.length === 0) {
          return res.status(404).send({ message: `No CSS paths to load.` })
        }

        // Compile the CSS (or retrieve from cache).
        fsCss.compile(sourcePaths, options)
        .then(result => {
              res.set("Content-Type", "text/css");
              res.send(result.css);
        })
        .catch(err => res.status(500).send({
              error: "Failed to compile CSS.",
              message: err.message,
              paths: sourcePaths
        }))
  };

  // Listen to GET requests for CSS.
  middleware.get("/css", (req, res) => {
      // Process the query-string converting it into a set
      // of paths that point to the source CSS files.
      let query = _.clone(req.query);
      query = !_.isEmpty(query)
          ? query
          : { global: true, pages: true, components: true, layouts: true };
      const sourcePaths = _.chain(query)
          .keys()
          .map(key => toSourcePath(key, query[key]))
          .flatten(true)
          .compact()
          .value();

      render(req, res, sourcePaths);
  });
};
