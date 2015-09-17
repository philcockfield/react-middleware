"use strict"
import { expect } from "chai";
import express from "express";
import ServerPages from "../src";
import request from "supertest";

const BASE_PATH = "./test/samples/site";


describe.only("middleware-css", function() {
  beforeEach(() => {
    ServerPages.clearCache();
  });


  it("retrieves all the css (/css)", (done) => {
    const app = express();
    app.use(ServerPages({ base:BASE_PATH }));
    request(app)
      .get("/css")
      .expect(200)
      .expect("Content-Type", "text/css; charset=utf-8")
      .end((err, res) => {
          expect(res.text).to.include("git.io/normalize");
          expect(res.text).to.include(".global {");
          expect(res.text).to.include("border: solid MIXIN_VALUE");
          expect(res.text).to.include(".Home {");
          expect(res.text).to.include(".MyComponent {");
          if (err) { return done(err); }
          done();
      });
  });
});
