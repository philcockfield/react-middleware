import _ from "lodash";
import express from "express";
import fsPath from "path";




/**
 * Returns the server middleware.
 */
export default (options = {}) => {
  const router = express.Router();


  // Prepare folder paths.
  let baseDir = options.base || "./";
  baseDir = _.startsWith(baseDir, ".")
                    ? fsPath.resolve(baseDir)
                    : baseDir
  const folder = (param, defaultPath) => {
        return options[param] || fsPath.join(baseDir, defaultPath)
      };
  // const cssDir = options.css || "/css";
  // const publicDir = options.public || "/public";
  // const layoutsDir = options.layouts || "/views/layouts";
  // const componentsDir = options.components || "/views/components";
  // const pagesDir = options.pages || "/views/pages";


  router.paths = {
    base: baseDir,
    css: folder("css", "/css"),
    public: folder("public", "/public"),
    layouts: folder("layouts", "/views/layouts"),
    components: folder("components", "/views/components"),
    pages: folder("pages", "/views/pages")
  };


  // Finish up.
  return router;
};
