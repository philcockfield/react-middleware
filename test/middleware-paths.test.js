"use strict"
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import ReactServerPages from "../src";


describe("middleware.paths", function() {
  describe("base", function() {
    it("has default", () => {
      const middleware = ReactServerPages();
      expect(middleware.paths.base).to.equal(fsPath.resolve("./"));
    });

    it("has custom (absolute)", () => {
      const middleware = ReactServerPages({ base: "/foo" });
      expect(middleware.paths.base).to.equal("/foo");
    });

    it("has custom (relative)", () => {
      expect(ReactServerPages({ base: "./foo" }).paths.base).to.equal(fsPath.resolve("./foo"));
      expect(ReactServerPages({ base: "../foo" }).paths.base).to.equal(fsPath.resolve("../foo"));
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
      const middleware = ReactServerPages({
        base: "foo",
        css: "foo",
        public: "foo",
        layouts: "foo",
        components: "foo",
        pages: "foo"
      });
      const paths = middleware.paths;
      expect(paths.base).to.equal("foo");
      expect(paths.css).to.equal("foo");
      expect(paths.public).to.equal("foo");
      expect(paths.layouts).to.equal("foo");
      expect(paths.components).to.equal("foo");
      expect(paths.pages).to.equal("foo");
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
