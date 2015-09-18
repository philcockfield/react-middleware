import fs from "fs-extra";
import fsPath from "path";



/**
 * Represents a template file.
 */
export default class Template {
  constructor(sourcePath, targetPath) {
    this.sourcePath = fsPath.join(__dirname, "./templates", sourcePath);
    this.targetPath = targetPath;
  }

  /**
   * Determines whether the file for the template already exists.
   */
  exists() { return fs.existsSync(this.targetPath); }

  /**
   * Copies the template file to the target path.
   */
  copy() {
    if (!this.exists()) {
      fs.copySync(this.sourcePath, this.targetPath);
    }
    return this;
  }

  /**
   * Imports the target file as a module.
   */
  import() {
    this.copy();
    return require(this.targetPath);
  }
}
