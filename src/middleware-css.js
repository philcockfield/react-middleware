import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import fsCss from "fs-css";

let NODE_ENV = process.env.NODE_ENV;
// NODE_ENV = "production";
const IS_PRODUCTION = NODE_ENV === "production";

const RESET_NAMES = ["normalize.css", "reset.css"];
const isCssReset = (path) => _.any(RESET_NAMES, name => _.endsWith(path, name));



export default (middleware) => {
  const { paths, templates } = middleware;
  const options = {
    watch: !IS_PRODUCTION,
    minify: IS_PRODUCTION,
    cache: true
  };

  if (!fs.existsSync(paths.css)) { return; }
  let cssResetPath = _.chain(fs.readdirSync(paths.css))
        .filter(isCssReset)
        .map(fileName => fsPath.join(paths.css, fileName))
        .value();


  const render = (req, res, path) => {
        let sourcePaths;
        if (path === "/") {
          sourcePaths = [ cssResetPath, paths.css ];
        }

        // Compile the CSS (or retrieve from cache).
        sourcePaths = _.flatten(sourcePaths);
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
  middleware.get("/css/*", (req, res) => render(req, res, `/${ req.params["0"] }`));
  middleware.get("/css", (req, res) => render(req, res, "/"));
};
