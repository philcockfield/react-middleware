import R from 'ramda';
import fs from 'fs-extra';
import fsPath from 'path';


const pathsStatus = (paths) => {
  const result = {};
  Object.keys(paths).forEach(key => {
    const path = paths[key];
    if (R.is(String, path)) {
      result[key] = fs.existsSync(path);
    }
  });
  return result;
};


const pathsExist = (paths) => {
  const values = R.values(pathsStatus(paths));
  const existsTotal = R.pipe(
      R.map(exists => (exists ? 1 : 0)),
      R.sum
    )(values);
  if (existsTotal === values.length) { return true; }
  if (existsTotal === 0) { return false; }
  return 'partial';
};


const createFoldersSync = (paths) => {
  Object.keys(paths).forEach(key => {
    const path = paths[key];
    if (R.is(String, path)) { fs.ensureDirSync(path); }
  });
  paths.exist = pathsExist(paths);
};






export default (options = {}) => {
  // Prepare folder paths.
  let baseDir = options.base || './';
  baseDir = baseDir.startsWith('.')
                    ? fsPath.resolve(baseDir)
                    : baseDir;

  const folder = (param, defaultPath) => options[param] || fsPath.join(baseDir, defaultPath);

  const paths = {
    base: baseDir,
    css: folder('css', '/css'),
    public: folder('public', '/public'),
    layouts: folder('layouts', '/views/layouts'),
    components: folder('components', '/views/components'),
    pages: folder('pages', '/views/pages'),
    scripts: folder('scripts', '/scripts'),
    createSync() { createFoldersSync(paths); },
  };
  paths.exist = pathsExist(paths);

  // Finish up.
  return paths;
};
