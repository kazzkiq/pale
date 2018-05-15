const mocha = require('mocha');
const expect = require('chai').expect;
const Pale = require('../../build/pale.min.js');

describe('Pale methods testing', () => {
  it('Should be a function', () => {
    expect(!!Pale).to.be.true;
  });
});
