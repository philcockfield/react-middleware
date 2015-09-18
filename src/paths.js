import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";



const pathsStatus = (paths) => {
  return _.transform(paths, (result, path, key) => {
        if (_.isString(path)) {
          result[key] = fs.existsSync(path);
        }
      });
};


const pathsExist = (paths) => {
  const values = _.values(pathsStatus(paths));
  const existsTotal = _.sum(values, (exists) => exists ? 1 : 0);
  if (existsTotal === values.length) { return true; }
  if (existsTotal === 0) { return false; }
  return "partial"
};


const createFolders = (paths) => {
  _.forIn(paths, (path, key) => {
    if (_.isString(path)) { fs.ensureDirSync(path); }
  });
  paths.exist = pathsExist(paths);
};






export default (options = {}) => {
  // Prepare folder paths.
  let baseDir = options.base || "./";
  baseDir = _.startsWith(baseDir, ".")
                    ? fsPath.resolve(baseDir)
                    : baseDir

  const folder = (param, defaultPath) => {
        return options[param] || fsPath.join(baseDir, defaultPath)
      };

  const paths = {
    base: baseDir,
    css: folder("css", "/css"),
    public: folder("public", "/public"),
    layouts: folder("layouts", "/views/layouts"),
    components: folder("components", "/views/components"),
    pages: folder("pages", "/views/pages"),
    js: folder("js", "/views/js"),
    create() { createFolders(paths); }
  };
  paths.exist = pathsExist(paths);

  // Finish up.
  return paths;
};
