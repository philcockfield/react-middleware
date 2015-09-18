"use strict"
import { expect } from "chai";
import express from "express";
import request from "supertest";
import ServerPages from "../src";

const BASE_PATH = "./test/samples/site";


describe("render: layout", function() {
  const render = (path, callback) => {
    const app = express();
    const middleware = ServerPages({ base:BASE_PATH });
    app.use(middleware);
    request(app)
      .get(path)
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .end((err, res) => callback(err, res.text));
  };

  it("renders Home in the main Html layout", (done) => {
    render("/", (err, result) => {
        expect(result).to.include("<html data-layout=\"html\"");
        expect(result).to.include("<div class=\"Home\"");
        if (err) { return done(err); }
        done();
    });
  });

  it("renders Home in the Mobile layout", (done) => {
    render("/mobile-layout", (err, result) => {
        expect(result).to.include("<html data-layout=\"mobile\"");
        expect(result).to.include("<div class=\"Home\"");
        if (err) { return done(err); }
        done();
    });
  });

  it("renders Home in the Mobile layout from function", (done) => {
    render("/mobile-layout-func", (err, result) => {
        expect(result).to.include("<html data-layout=\"mobile\"");
        expect(result).to.include("<div class=\"Home\"");
        if (err) { return done(err); }
        done();
    });
  });

  it("renders a JSX file in the root layouts folder", (done) => {
    render("/root-layout", (err, result) => {
        expect(result).to.include("<html data-layout=\"root\"");
        expect(result).to.include("<div class=\"Home\"");
        if (err) { return done(err); }
        done();
    });
  });
});
