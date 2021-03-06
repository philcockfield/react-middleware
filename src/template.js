/* eslint global-require:0 */
import fs from 'fs-extra';
import fsPath from 'path';



/**
 * Represents a template file.
 */
export default class Template {
  constructor(sourcePath, targetPath) {
    this.sourcePath = fsPath.join(__dirname, '../templates', sourcePath);
    this.targetPath = targetPath;
  }

  /**
   * Determines whether the file for the template already exists.
   */
  existsSync() { return fs.existsSync(this.targetPath); }

  /**
   * Copies the template file to the target path.
   */
  copySync() {
    if (!this.existsSync()) {
      fs.copySync(this.sourcePath, this.targetPath);
    }
    return this;
  }

  /**
   * Imports the target file as a module.
   */
  import() {
    this.copySync();
    return require(this.targetPath).default;
  }
}
