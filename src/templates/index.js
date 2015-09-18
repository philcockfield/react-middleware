import _ from "lodash";
import Template from "../template";




/**
 * Returns the set of template files.
 * @param paths: The middleware folder paths object.
 */
export default (paths) => {
  const template = (fileName, targetFolder) => {
      const sourcePath = `./${ fileName }`;
      const targetPath = `${ targetFolder }/${ fileName }`;
      return new Template(sourcePath, targetPath);
  };

  const templates = {
    routes: template("routes.js", paths.base),
    html: template("Html/Html.jsx", `${ paths.layouts }/Html`),
    htmlCss: template("Html/Html.styl", `${ paths.layouts }/Html`),
    home: template("Home/Home.jsx", `${ paths.pages }/Home`),
    homeCss: template("Home/Home.styl", `${ paths.pages }/Home`),
    normalize: template("normalize.css", paths.css),

    /**
     * Creates all template files if they don't already exist.
     */
    create() {
      paths.create();
      _.forIn(templates, (file) => {
          if (file instanceof Template) {
            file.copy();
          }
      });
    }
  };

  return templates;
};
