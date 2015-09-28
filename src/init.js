import fs from "fs-extra";
import fsPath from "path";


const packageVersion = (modulePath) => fs.readJsonSync(fsPath.join(modulePath, "package.json")).version;


/**
 * Ensure the `react` module exists within root module
 * and that it is the correct version.
 */
const REACT_PATH = fsPath.join(__dirname, "../node_modules/react")
const PARENT_REACT_PATH = fsPath.resolve("./node_modules/react");
if (REACT_PATH !== PARENT_REACT_PATH) {
  if (fs.existsSync(PARENT_REACT_PATH)) {
    // Ensure matching version.
    const REQUIRED_VERSION = packageVersion(REACT_PATH);
    const CURRENT_VERSION = packageVersion(PARENT_REACT_PATH);
    if (REQUIRED_VERSION !== CURRENT_VERSION) {
      throw new Error(`Wrong version of 'react' installed. '${ REQUIRED_VERSION }' is required, the current version is '${ CURRENT_VERSION }'.`);
    }
  } else {
    // Copy the 'react' module into root.
    // NOTE: This is used by JSX files.
    fs.copySync(REACT_PATH, PARENT_REACT_PATH);
  }
}
