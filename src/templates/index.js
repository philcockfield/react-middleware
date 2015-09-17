import _ from "lodash";
import TemplateFile from "../template-file";




/**
 * Returns the set of template files.
 * @param paths: The middleware folder paths object.
 */
export default (paths) => {
  const template = (fileName, targetFolder) => {
      const sourcePath = `./${ fileName }`;
      const targetPath = `${ targetFolder }/${ fileName }`;
      return new TemplateFile(sourcePath, targetPath);
  };

  const templates = {
    routes: template("routes.js", paths.base),
    html: template("Html.jsx", paths.layouts),
    home: template("Home.jsx", `${ paths.pages }/Home`),
    homeCss: template("Home.styl", `${ paths.pages }/Home`),
    normalize: template("normalize.css", paths.css),

    /**
     * Creates all template files if they don't already exist.
     */
    create() {
      paths.create();
      _.forIn(templates, (file) => {
        if (file instanceof TemplateFile) {
          file.copy();
        }
      });
    }
  };

  return templates;
};
