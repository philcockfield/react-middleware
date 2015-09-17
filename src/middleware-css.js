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
        if (!_.isArray(sourcePaths)) { sourcePaths = [sourcePaths]; }
        // sourcePaths.push([ cssResetPath, paths.css ]);
        sourcePaths = ([ cssResetPath, paths.css, sourcePaths ]);

        // Compile the CSS (or retrieve from cache).
        sourcePaths = _.flatten(sourcePaths);
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
  middleware.get("/css", (req, res) => render(req, res));
  middleware.get("/css/page/:page", (req, res) => render(req, res, `${ paths.pages }/${ req.params.page }`));
};
