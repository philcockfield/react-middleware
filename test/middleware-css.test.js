"use strict"
import { expect } from "chai";
import express from "express";
import request from "supertest";
import ServerPages from "../src";

const BASE_PATH = "./test/samples/site";


describe("middleware-css", function() {
  beforeEach(() => ServerPages.clearCache());
  afterEach(() => ServerPages.clearCache());

  it("retrieves all the CSS", (done) => {
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

  it("returns global CSS only", (done) => {
    const app = express();
    app.use(ServerPages({ base:BASE_PATH }));
    request(app)
      .get("/css?global")
      .end((err, res) => {
          expect(res.text).to.include("git.io/normalize");
          expect(res.text).to.include(".global {");
          expect(res.text).not.to.include(".Home {");
          expect(res.text).not.to.include(".MyComponent {");
          if (err) { return done(err); }
          done();
    });
  });

  describe("pages", function() {
    it("returns CSS for a single page", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?page=Features")
        .end((err, res) => {
            expect(res.text).not.to.include("git.io/normalize");
            expect(res.text).not.to.include(".global {");
            expect(res.text).not.to.include(".Home {");
            expect(res.text).not.to.include(".MyComponent {");
            expect(res.text).to.include(".Features {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for several specific pages", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?page=Home, Features")
        .end((err, res) => {
            expect(res.text).to.include(".Features {");
            expect(res.text).to.include(".Home {");
            expect(res.text).not.to.include(".Pricing {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for all pages", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?pages")
        .end((err, res) => {
            expect(res.text).to.include(".Features {");
            expect(res.text).to.include(".Home {");
            expect(res.text).to.include(".Pricing {");
            if (err) { return done(err); }
            done();
      });
    });
  });


  describe("components", function() {
    it("returns CSS for a single component", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?component=MyComponent")
        .end((err, res) => {
            expect(res.text).to.include(".MyComponent {");
            expect(res.text).not.to.include(".Spinner {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for all components", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?components")
        .end((err, res) => {
            expect(res.text).to.include(".MyComponent {");
            expect(res.text).to.include(".Spinner {");
            if (err) { return done(err); }
            done();
      });
    });
  });

  describe("layouts", function() {
    it("returns CSS for a single layout", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?layout=Mobile")
        .end((err, res) => {
            expect(res.text).to.include("body.mobile {");
            expect(res.text).not.to.include("body.desktop {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for all layouts", (done) => {
      const app = express();
      app.use(ServerPages({ base:BASE_PATH }));
      request(app)
        .get("/css?layouts")
        .end((err, res) => {
            expect(res.text).to.include("body.mobile {");
            expect(res.text).to.include("body.desktop {");
            if (err) { return done(err); }
            done();
      });
    });
  });
});
