"use strict"
import { expect } from "chai";
import R from 'ramda';
import api from '../src';


describe('Main API (module)', function() {
  it('the main API is a function', () => {
    expect(api).to.be.an.instanceof(Function);
  });

  it('exposes `start` method', () => {
    expect(api.start).to.be.an.instanceof(Function);
  });

  it('exposes `init` method', () => {
    expect(api.init).to.be.an.instanceof(Function);
  });

  it('exposes `clearCache` method', () => {
    expect(api.clearCache).to.be.an.instanceof(Function);
  });
});
