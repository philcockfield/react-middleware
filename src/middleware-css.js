import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import fsCss from "fs-css";

let NODE_ENV = process.env.NODE_ENV;
const IS_PRODUCTION = NODE_ENV === "production";

const RESET_NAMES = ["normalize.css", "reset.css"];
const isCssReset = (path) => _.any(RESET_NAMES, name => _.endsWith(path, name));



export default (middleware) => {
  const { paths, templates } = middleware;
  const COMPILER_OPTIONS = {
    watch: !IS_PRODUCTION,
    minify: IS_PRODUCTION,
    cache: true,
    pathsRequired: false
  };

  if (!fs.existsSync(paths.css)) { return; }
  let cssResetPath = _.chain(fs.readdirSync(paths.css))
        .filter(isCssReset)
        .map(fileName => fsPath.join(paths.css, fileName))
        .value();


  const render = (req, res, sourcePaths = []) => {
        // Prep the source paths.
        if (!_.isArray(sourcePaths)) { sourcePaths = [sourcePaths]; }
        sourcePaths = _.flatten(sourcePaths);
        if (sourcePaths.length === 0) {
          return res.status(404).send({ message: `No CSS paths to load` })
        }

        // Compile the CSS (or retrieve from cache).
        fsCss.compile(sourcePaths, COMPILER_OPTIONS)
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
      const toPaths = (base, value) => {
        return _.chain(value)
                .split(",")
                .map(folder => `${ base }/${ _.trim(folder) }`)
                .value();
      };

      const toPath = (key, value) => {
          const path = paths[key];
          switch (key) {
            case "global": return [ cssResetPath, paths.css ];

            case "layouts": return paths.layouts;
            case "layout": return toPaths(paths.layouts, value);

            case "pages": return paths.pages;
            case "page": return toPaths(paths.pages, value);

            case "components": return paths.components;
            case "component": return toPaths(paths.components, value);
          }
      };

      let query = _.clone(req.query);
      query = !_.isEmpty(query)
          ? query
          : { global: true, pages: true, components: true, layouts: true };
      const sourcePaths = _.chain(query)
          .keys()
          .map(key => toPath(key, query[key]))
          .flatten(true)
          .compact()
          .value();

      render(req, res, sourcePaths);
  });
};
