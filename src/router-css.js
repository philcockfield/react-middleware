/* eslint max-len:0 */

import R from 'ramda';
import fs from 'fs-extra';
import fsPath from 'path';
import css from 'file-system-css';
import chalk from 'chalk';
import log from './log';

const RESET_NAMES = ['normalize.css', 'reset.css'];
const isCssReset = (path) => R.any(name => path.endsWith(name), RESET_NAMES);


export const getOptions = (options = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    cache: true,
    pathsRequired: false,
    watch: options.watch === undefined ? !isProduction : options.watch,
    minify: options.minify === undefined ? isProduction : options.minify,
  };
};

const isMixin = (path) => {
  const name = fsPath.basename(path, '.styl');
  if (name === 'mixin') { return true; }
  if (name.endsWith('.mixin')) { return true; }
  return false;
};



export default (middleware, paths, options = {}) => {
  options = getOptions(options);

  // Bail out if the /css folder does not exist.
  if (!fs.existsSync(paths.css)) { return; }

  // Determine whether a CSS reset file exists within /css.
  const globalCssPaths = fs.readdirSync(paths.css).map(path => fsPath.join(`${ paths.css }/${ path }`));
  const globalMixinPaths = R.filter(isMixin, globalCssPaths);
  const cssResetPath = R.pipe(
    R.filter(isCssReset),
    R.map(fileName => fsPath.join(paths.css, fileName))
  )(globalCssPaths);


  const toSourcePath = (key, value) => {
    const expandPaths = (base, path) =>
      R.pipe(
        R.split(','),
        R.map(folder => `${ base }/${ folder.trim() }`)
      )(path);

    switch (key) {
      case 'global': return [cssResetPath, paths.css];

      case 'layouts': return paths.layouts;
      case 'layout': return expandPaths(paths.layouts, value);

      case 'pages': return paths.pages;
      case 'page': return expandPaths(paths.pages, value);

      case 'components': return paths.components;
      case 'component': return expandPaths(paths.components, value);

      default: // No match.
    }
  };

  const queryToSourcePaths = (query) => {
    // Process the query-string converting it into a set
    // of paths that point to the source CSS files.
    query = R.clone(query);
    query = Object.keys(query).length === 0
        ? { global: true, pages: true, components: true, layouts: true }
        : query;

    return R.pipe(
      R.keys,
      R.map(key => toSourcePath(key, query[key])),
      R.flatten(),
      R.reject(R.isNil)
    )(query);
  };


  // Render the CSS response.
  const render = (req, res, sourcePaths = []) => {
    // Prep the source paths.
    if (!R.is(Array, sourcePaths)) { sourcePaths = [sourcePaths]; }
    sourcePaths = R.flatten(sourcePaths);
    if (sourcePaths.length === 0) {
      return res.status(404).send({ message: `No CSS paths to load.` });
    }

    // Compile the CSS (or retrieve from cache).
    css.compile([globalMixinPaths, sourcePaths], options)
    .then(result => {
      const cssResult = result.css;
      if (R.is(String, cssResult)) {
        res.set('Content-Type', 'text/css');
        res.send(cssResult);
      } else {
        res.status(404).send({ message: `No CSS at ${ req.url }` });
      }
    })
    .catch(err => {
      const args = {
        error: `Failed to compile CSS for URL path '${ req.url }'`,
        message: err.message,
        paths: sourcePaths,
      };
      log.error(chalk.red(args.error));
      log.error(chalk.red(args.message));
      res.status(500).send(args);
    });
  };

  const renderGroup = (req, res, keys = []) => {
    const query = {};
    keys.forEach(key => query[key] = true);
    render(req, res, queryToSourcePaths(query));
  };

  const renderSpecific = (req, res, key) => {
    const query = { [key]: req.params.name };
    render(req, res, queryToSourcePaths(query));
  };

  // Listen to GET requests for CSS.
  middleware.get('/css', (req, res) => render(req, res, queryToSourcePaths(req.query)));
  middleware.get('/css/common', (req, res) => renderGroup(req, res, ['global', 'layouts', 'components']));
  middleware.get('/css/global', (req, res) => renderGroup(req, res, ['global']));

  middleware.get('/css/pages', (req, res) => renderGroup(req, res, ['pages']));
  middleware.get('/css/page/:name', (req, res) => renderSpecific(req, res, 'page'));

  middleware.get('/css/layouts', (req, res) => renderGroup(req, res, ['layouts']));
  middleware.get('/css/layout/:name', (req, res) => renderSpecific(req, res, 'layout'));

  middleware.get('/css/components', (req, res) => renderGroup(req, res, ['components']));
  middleware.get('/css/component/:name', (req, res) => renderSpecific(req, res, 'component'));
};
