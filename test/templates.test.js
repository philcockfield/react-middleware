"use strict"
import _ from "lodash";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import ReactMiddleware from "../src";

const BASE_PATH = "./test/samples/sample-templates";


describe("templates", function() {
  let middleware;
  beforeEach(() => {
    middleware = ReactMiddleware({ base: BASE_PATH });
    middleware.paths.createSync();
  });

  const deleteFolder = () => { fs.removeSync(fsPath.resolve(BASE_PATH)); }
  afterEach(() => { deleteFolder(); });


  it("files do not exist", () => {
    deleteFolder();
    _.forIn(middleware.templates, (file) => {
      if (_.isFunction(file.exists)) {
        expect(file.exists()).to.equal(false);
      }
    });
  });

  it("files do exist", () => {
    middleware.templates.createSync();
    _.forIn(middleware.templates, (file) => {
      if (_.isFunction(file.exists)) {
        expect(file.exists()).to.equal(true);
      }
    });
  });

  it("does not overwrite file", () => {
    const templates = middleware.templates;
    const path = templates.routes.targetPath;
    fs.removeSync(path);
    fs.outputFileSync(path, "let foo = 123;");
    templates.createSync();
    expect(fs.readFileSync(path).toString()).to.equal("let foo = 123;");
  });
});
