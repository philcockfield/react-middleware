import _ from "lodash";
import Template from "./template";




/**
 * Returns the set of template files.
 * @param paths: The middleware folder paths object.
 */
export default (paths) => {
  const template = (sourceDir, sourceFile, targetFolder) => {
      sourceDir = _.isString(sourceDir) ? sourceDir + "/" : "";
      const sourcePath = `../templates/${ sourceDir }${ sourceFile }`;
      const targetPath = `${ targetFolder }/${ sourceFile }`;
      return new Template(sourcePath, targetPath);
  };

  const templates = {
    routes: template(null, "routes.js", paths.base),
    html: template("Html", "Html.jsx", `${ paths.layouts }/Html`),
    htmlCss: template("Html", "Html.styl", `${ paths.layouts }/Html`),
    home: template("Home", "Home.jsx", `${ paths.pages }/Home`),
    homeCss: template("Home", "Home.styl", `${ paths.pages }/Home`),
    homeEntry: template("Home", "entry.js", `${ paths.pages }/Home`),
    normalizeCss: template("css", "normalize.css", paths.css),
    globalMixins: template("css", "global.mixin.styl", paths.css),
    scripts: template("scripts", "index.js", paths.scripts),
    imageMoon1x: template("images", "moon.jpg", `${ paths.public }/images`),
    imageMoon2x: template("images", "moon@2x.jpg", `${ paths.public }/images`),

    /**
     * Creates all template files if they don't already exist.
     */
    createSync() {
      paths.createSync();
      _.forIn(templates, (file) => {
          if (file instanceof Template) {
            file.copySync();
          }
      });
    }
  };

  return templates;
};
