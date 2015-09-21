"use strict"
import { expect } from "chai";
import { getOptions } from "../src/router-css";

const NODE_ENV = process.env.NODE_ENV


describe("css (options)", function() {
  afterEach(() => {
    process.env.NODE_ENV = NODE_ENV; // Reset the environment.
  });

  it("caches", () => {
    expect(getOptions().cache).to.equal(true);
  });

  it("does not require CSS paths to exist", () => {
    expect(getOptions().pathsRequired).to.equal(false);
  });


  describe("`watch` option", function() {
    it("by default it watches when in 'development'", () => {
      process.env.NODE_ENV = "development";
      expect(getOptions().watch).to.equal(true);
    });

    it("by default it does not watch when in 'production'", () => {
      process.env.NODE_ENV = "production";
      expect(getOptions().watch).to.equal(false);
    });

    it("uses explicitly passed value", () => {
      process.env.NODE_ENV = "development";
      expect(getOptions({ watch: false }).watch).to.equal(false);

      process.env.NODE_ENV = "production";
      expect(getOptions({ watch: true }).watch).to.equal(true);
    });
  });


  describe("`minify`", function() {
    it("by default it minifies when in 'development'", () => {
      process.env.NODE_ENV = "development";
      expect(getOptions().minify).to.equal(false);
    });

    it("by default it does not minify when in 'production'", () => {
      process.env.NODE_ENV = "production";
      expect(getOptions().minify).to.equal(true);
    });

    it("uses explicitly passed value", () => {
      process.env.NODE_ENV = "development";
      expect(getOptions({ minify: true }).minify).to.equal(true);

      process.env.NODE_ENV = "production";
      expect(getOptions({ minify: false }).minify).to.equal(false);
    });
  });
});
