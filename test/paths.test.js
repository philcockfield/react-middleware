"use strict"
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import ReactMiddleware from "../src";



describe("middleware.paths", function() {
  const deleteFolders = () => {
    fs.removeSync(fsPath.resolve("./test/samples/base"));
    fs.removeSync(fsPath.resolve("./test/samples/custom"));
    fs.removeSync(fsPath.resolve("./test/sample-paths"));
  };
  beforeEach(() => deleteFolders());
  afterEach(() => deleteFolders());


  describe("base", function() {
    it("has custom (absolute)", () => {
      const path = fsPath.resolve("./test/samples/base");
      const middleware = ReactMiddleware({ base: path });
      expect(middleware.paths.base).to.equal(path);
    });

    it("has custom (relative)", () => {
      const path = "./test/samples/base"
      expect(ReactMiddleware({ base: path }).paths.base).to.equal(fsPath.resolve(path));
    });
  });

  describe("project structure", function() {
    it("has default paths", () => {
      const middleware = ReactMiddleware({ base: "./test/samples/site" });
      const paths = middleware.paths;
      expect(paths.css).to.equal(`${ paths.base }/css`);
      expect(paths.public).to.equal(`${ paths.base }/public`);
      expect(paths.layouts).to.equal(`${ paths.base }/views/layouts`);
      expect(paths.components).to.equal(`${ paths.base }/views/components`);
      expect(paths.pages).to.equal(`${ paths.base }/views/pages`);
      expect(paths.scripts).to.equal(`${ paths.base }/scripts`);
    });

    it("has custom paths", () => {
      const path = fsPath.resolve("./test/samples/custom");
      const middleware = ReactMiddleware({
        base: path,
        css: path,
        public: path,
        layouts: path,
        components: path,
        pages: path,
        scripts: path
      });
      const paths = middleware.paths;
      expect(paths.base).to.equal(path);
      expect(paths.css).to.equal(path);
      expect(paths.public).to.equal(path);
      expect(paths.layouts).to.equal(path);
      expect(paths.components).to.equal(path);
      expect(paths.pages).to.equal(path);
      expect(paths.scripts).to.equal(path);
    });
  });



  describe("folder creation", function() {
    const BASE_PATH = "./test/sample-paths";

    it("does not have folders", () => {
      const middleware = ReactMiddleware({ base: BASE_PATH });
      expect(middleware.paths.exist).to.equal(false);
    });

    it("creates folders", () => {
      const middleware = ReactMiddleware({ base: BASE_PATH });
      middleware.paths.createSync();
      expect(middleware.paths.exist).to.equal(true);
    });

    it("has partial folders", () => {
      ReactMiddleware({ base: BASE_PATH }).paths.createSync();
      fs.removeSync(fsPath.resolve(BASE_PATH, "views/pages"));
      const middleware = ReactMiddleware({ base: BASE_PATH });
      expect(middleware.paths.exist).to.equal("partial");
    });

  });
});
