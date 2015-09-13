"use strict"
import _ from "lodash";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import ReactServerPages from "../src";

const BASE_PATH = "./test/sample-templates";


describe("templates", function() {
  let middleware;
  beforeEach(() => {
    middleware = ReactServerPages({ base: BASE_PATH });
    middleware.paths.create();
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
    middleware.templates.create();
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
    templates.create();
    expect(fs.readFileSync(path).toString()).to.equal("let foo = 123;");
  });
});
