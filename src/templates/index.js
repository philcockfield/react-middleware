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
}


/**
 * Returns the set of template files.
 * @param paths: The middleware folder paths object.
 */
export default (paths) => {
  const templates = {
    routes: new TemplateFile("./routes.js", `${ paths.base }/routes.js`),

    /**
     * Creates all template files if they don't already exist.
     */
    create() {
      _.forIn(templates, (file) => {
        if (file instanceof TemplateFile) {
          file.copy();
        }
      });
    }
  };

  return templates;
};
