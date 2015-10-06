"use strict"
import { expect } from "chai";
import express from "express";
import request from "supertest";
import ReactMiddleware from "../src";

const BASE_PATH = "./test/samples/site";


describe("css", function() {
  this.timeout(10000);
  beforeEach(() => ReactMiddleware.clearCache());
  afterEach(() => ReactMiddleware.clearCache());


  const render = (path, callback) => {
    const app =
      express()
      .use(ReactMiddleware({ base:BASE_PATH, watch: false }));
    request(app)
      .get(path)
      .expect(200)
      .expect("Content-Type", "text/css; charset=utf-8")
      .end((err, res) => callback(err, res.text));
  };


  it("retrieves all the CSS", (done) => {
    render("/css", (err, text) => {
          expect(text).to.include("git.io/normalize");
          expect(text).to.include(".global {");
          expect(text).to.include("border: solid MIXIN_VALUE");
          expect(text).to.include(".Home {");
          expect(text).to.include(".MyComponent {");
          if (err) { return done(err); }
          done();
    });
  });

  it("returns global CSS only", (done) => {
    render("/css?global", (err, text) => {
          expect(text).to.include("git.io/normalize");
          expect(text).to.include(".global {");
          expect(text).not.to.include(".Home {");
          expect(text).not.to.include(".MyComponent {");
          if (err) { return done(err); }
          done();
    });
  });

  describe("pages", function() {
    it("returns CSS for a single page", (done) => {
      render("/css?page=Features", (err, text) => {
              expect(text).not.to.include("git.io/normalize");
              expect(text).not.to.include(".global {");
              expect(text).not.to.include(".Home {");
              expect(text).not.to.include(".MyComponent {");
              expect(text).to.include(".Features {");
              if (err) { return done(err); }
              done();
      });
    });

    it("returns CSS for several specific pages", (done) => {
      render("/css?page=Home, Features", (err, text) => {
            expect(text).to.include(".Features {");
            expect(text).to.include(".Home {");
            expect(text).not.to.include(".Pricing {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for all pages", (done) => {
      render("/css?pages", (err, text) => {
            expect(text).to.include(".Features {");
            expect(text).to.include(".Home {");
            expect(text).to.include(".Pricing {");
            if (err) { return done(err); }
            done();
      });
    });
  });


  describe("components", function() {
    it("returns CSS for a single component", (done) => {
      render("/css?component=MyComponent", (err, text) => {
            expect(text).to.include(".MyComponent {");
            expect(text).not.to.include(".Spinner {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for all components", (done) => {
      render("/css?components", (err, text) => {
            expect(text).to.include(".MyComponent {");
            expect(text).to.include(".Spinner {");
            if (err) { return done(err); }
            done();
      });
    });
  });

  describe("layouts", function() {
    it("returns CSS for a single layout", (done) => {
      render("/css?layout=Mobile", (err, text) => {
            expect(text).to.include("body.mobile {");
            expect(text).not.to.include("body.desktop {");
            if (err) { return done(err); }
            done();
      });
    });

    it("returns CSS for all layouts", (done) => {
      render("/css?layouts", (err, text) => {
            expect(text).to.include("body.mobile {");
            expect(text).to.include("body.desktop {");
            if (err) { return done(err); }
            done();
      });
    });
  });
});
