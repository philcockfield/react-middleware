import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";



/**
 * Represents a template file.
 */
class TemplateFile {
  constructor(sourcePath, targetPath) {
    this.sourcePath = fsPath.join(__dirname, sourcePath);
    this.targetPath = targetPath;
  }
  exists() { return fs.existsSync(this.targetPath); }
  copy() {
    if (!this.exists()) {
      fs.copySync(this.sourcePath, this.targetPath);
    }
    return this;
  }
  import() {
    this.copy();
    return require(this.targetPath);
  }
}


/**
 * Returns the set of template files.
 * @param paths: The middleware folder paths object.
 */
export default (paths) => {
  const templates = {
    routes: new TemplateFile("./routes.js", `${ paths.base }/routes.js`),
    html: new TemplateFile("./Html.jsx", `${ paths.layouts }/Html.jsx`),
    home: new TemplateFile("./Home.jsx", `${ paths.pages }/Home/Home.jsx`),

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
