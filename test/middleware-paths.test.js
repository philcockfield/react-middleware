"use strict"
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import ReactServerPages from "../src";


describe("middleware.paths", function() {
  const deleteFooFolder = () => { fs.removeSync(fsPath.resolve("./foo")); };
  afterEach(() => { deleteFooFolder(); });


  describe("base", function() {
    it("has default", () => {
      const middleware = ReactServerPages();
      expect(middleware.paths.base).to.equal(fsPath.resolve("./"));
    });

    it("has custom (absolute)", () => {
      const path = fsPath.resolve("./foo");
      const middleware = ReactServerPages({ base: path });
      expect(middleware.paths.base).to.equal(path);
    });

    it("has custom (relative)", () => {
      expect(ReactServerPages({ base: "./foo" }).paths.base).to.equal(fsPath.resolve("./foo"));
    });
  });

  describe("project structure", function() {
    it("has default paths", () => {
      const middleware = ReactServerPages();
      const paths = middleware.paths;
      expect(paths.css).to.equal(`${ paths.base }/css`);
      expect(paths.public).to.equal(`${ paths.base }/public`);
      expect(paths.layouts).to.equal(`${ paths.base }/views/layouts`);
      expect(paths.components).to.equal(`${ paths.base }/views/components`);
      expect(paths.pages).to.equal(`${ paths.base }/views/pages`);
    });

    it("has custom paths", () => {
      const path = fsPath.resolve("./foo");
      const middleware = ReactServerPages({
        base: path,
        css: path,
        public: path,
        layouts: path,
        components: path,
        pages: path
      });
      const paths = middleware.paths;
      expect(paths.base).to.equal(path);
      expect(paths.css).to.equal(path);
      expect(paths.public).to.equal(path);
      expect(paths.layouts).to.equal(path);
      expect(paths.components).to.equal(path);
      expect(paths.pages).to.equal(path);
    });
  });



  describe("folder creation", function() {
    const BASE_PATH = "./test/sample-paths";
    const deleteFolder = () => { fs.removeSync(fsPath.resolve(BASE_PATH)); };
    beforeEach(() => { deleteFolder(); });
    afterEach(() => { deleteFolder(); });

    it("does not have folders", () => {
      const middleware = ReactServerPages({ base: BASE_PATH });
      expect(middleware.paths.exist).to.equal(false);
    });

    it("creates folders", () => {
      const middleware = ReactServerPages({ base: BASE_PATH });
      middleware.paths.create();
      expect(middleware.paths.exist).to.equal(true);
    });

    it("has partial folders", () => {
      ReactServerPages({ base: BASE_PATH }).paths.create();
      fs.removeSync(fsPath.resolve(BASE_PATH, "views/pages"));
      const middleware = ReactServerPages({ base: BASE_PATH });
      expect(middleware.paths.exist).to.equal("partial");
    });

  });
});
