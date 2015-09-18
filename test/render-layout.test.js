"use strict"
import { expect } from "chai";
import express from "express";
import request from "supertest";
import ServerPages from "../src";

const BASE_PATH = "./test/samples/site";


describe.only("render: layout", function() {
  beforeEach(() => ServerPages.clearCache());
  afterEach(() => ServerPages.clearCache());

  const render = (path, middleware, callback) => {
    const app = express();
    app.use(middleware);
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .end((err, res) => callback(err, res.text));
  };

  it("renders Home in the main Html layout", (done) => {
    const middleware = ServerPages({ base:BASE_PATH });
    render("/", middleware, (err, result) => {
        expect(result).to.include("<html data-layout=\"html\"");
        if (err) { return done(err); }
        done();
    });
  });
});
