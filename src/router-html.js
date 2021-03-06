/* eslint global-require:0 */

import R from 'ramda';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs-extra';
import fsPath from 'path';
import Url from 'url';
import * as util from 'js-util';

const NODE_ENV = process.env.NODE_ENV || 'development';


const asValues = (obj, args) => {
  const result = R.clone(obj);
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (R.is(Function, value)) {
      result[key] = value(args); // Convert the function into a value.
    } else if (R.is(Object, value)) {
      result[key] = asValues(value, args); // <== RECURSION.
    }
  });
  return result;
};



const getFilePath = (basePath, name, extension) => {
  let path;
  name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the file/folder name.

  // Look first for the existence of a stand-alone file.
  path = fsPath.join(basePath, `${ name }.${ extension }`);
  if (fs.existsSync(path)) { return path; }

  // Look for the file within a folder.
  path = fsPath.join(basePath, name, `${ name }.${ extension }`);
  if (fs.existsSync(path)) { return path; }

  return undefined;
};



export default (middleware, paths, routes, data) => {
  const getLayout = (route) => {
    const layoutName = route.layout || 'Html';
    const path = getFilePath(paths.layouts, layoutName, 'jsx');
    if (!path) { throw new Error(`A layout named '${ layoutName }' does not exist.`); }
    return require(path).default;
  };

  const getPage = (route) => {
    const pageName = route.page;
    const path = getFilePath(paths.pages, pageName, 'jsx');
    if (!path) { throw new Error(`A page named '${ pageName }' does not exist.`); }
    return require(path).default;
  };

  function getData(route, url) {
    return R.is(Function, data) ? data({ route, url }) : data;
  }

  const render = (req, res, route) => {
    // Setup initial conditions.
    const host = req.get('host');
    const params = Object
      .keys(req.params)
      .forEach(key => { req.params[key] = util.toType(req.params[key]); });
    const url = {
      params,
      path: req.url,
      pathname: Url.parse(req.url).pathname,
      query: req.query,
      pattern: route.pattern,
      protocol: req.secure ? 'https:' : 'http',
      host: host.split(':')[0],
      port: host.split(':')[1],
    };
    const args = { url };
    route = asValues(route, args);

    // Prepare the page body.
    const requestData = { url };
    const layoutData = getData(route, url);
    const pageProps = route.props || {};
    const pageData = pageProps.data || layoutData;
    if (pageData) {
      pageProps.data = pageData;
    }
    pageProps.request = requestData;
    const pageBody = React.createElement(getPage(route), pageProps);

    // Prepare the root <Html> page props.
    const layoutProps = {
      title: route.title,
      body: pageBody,
      data: layoutData,
      env: NODE_ENV,
      page: { name: route.page },
      request: requestData,
    };

    // Convert the page-layout into HTML.
    const layout = React.createElement(getLayout(route), layoutProps);
    const html = ReactDOMServer.renderToStaticMarkup(layout);
    res.send(html);
  };

  // Register each route as a GET handler.
  Object.keys(routes).forEach(pattern => {
    const route = routes[pattern];
    route.pattern = pattern;
    middleware.get(pattern, (req, res) => { render(req, res, route); });
  });
};
