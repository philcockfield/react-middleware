"use strict"
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import ReactMiddleware from "../src";
import * as util from "js-util";

const PATH = "./test/samples/init-test"
const deleteFolder = () => fs.removeSync(fsPath.resolve(PATH));

describe("init", function() {
  beforeEach(() => deleteFolder());
  afterEach(() => deleteFolder());

  it("returns the module API", () => {
    const result = ReactMiddleware.init(PATH);
    expect(result).to.equal(ReactMiddleware);
  });

  it("creates the folder structure", () => {
    expect(fs.existsSync(fsPath.resolve(PATH))).to.equal(false);
    ReactMiddleware.init(PATH);
    expect(fs.existsSync(fsPath.resolve(PATH))).to.equal(true);
    expect(fs.existsSync(fsPath.resolve(PATH, "routes.js"))).to.equal(true);
  });
});
