require("reify");
const mocha = require('mocha');
const expect = require('chai').expect;
const Pale = require('../../build/pale.min.js');
const { validators } = require('../../src/validators');

describe('Testing Validators', () => {
  it('string()', () => {
    expect(validators.string('test')).to.be.true;
    expect(validators.string('abc def')).to.be.true;
    expect(validators.string('abc123')).to.be.false;
    expect(validators.string('123abc')).to.be.false;
    expect(validators.string('123')).to.be.false;
    expect(validators.string('')).to.be.true;
    expect(validators.string(123)).to.be.false;
    expect(validators.string(null)).to.be.true;
    expect(validators.string(undefined)).to.be.true;
  });

  it('number()', () => {
    expect(validators.number('test')).to.be.false;
    expect(validators.number('abc def')).to.be.false;
    expect(validators.number('abc123')).to.be.false;
    expect(validators.number('123abc')).to.be.false;
    expect(validators.number('123')).to.be.true;
    expect(validators.number('')).to.be.false;
    expect(validators.number(123)).to.be.true;
    expect(validators.number(null)).to.be.false;
    expect(validators.number(undefined)).to.be.false;
  });

  it('min()', () => {
    expect(validators.min('test', 100)).to.be.false;
    expect(validators.min('149', '150')).to.be.false;
    expect(validators.min('150', '150')).to.be.true;
    expect(validators.min('151', '150')).to.be.true;
    expect(validators.min('150')).to.be.false;
  });

  it('max()', () => {
    expect(validators.max('test', 100)).to.be.false;
    expect(validators.max('149', '150')).to.be.true;
    expect(validators.max('150', '150')).to.be.true;
    expect(validators.max('151', '150')).to.be.false;
    expect(validators.max('150')).to.be.false;
  });

  it('minLength()', () => {
    expect(validators.minLength('test', 10)).to.be.false;
    expect(validators.minLength('abc', '1')).to.be.true;
    expect(validators.minLength('abc', '2')).to.be.true;
    expect(validators.minLength('abc', '3')).to.be.true;
    expect(validators.minLength('abc', '4')).to.be.false;
    expect(validators.minLength('abc')).to.be.false;
    expect(validators.minLength(10)).to.be.false;
  });

  it('maxLength()', () => {
    expect(validators.maxLength('test', 10)).to.be.true;
    expect(validators.maxLength('abc', '1')).to.be.false;
    expect(validators.maxLength('abc', '2')).to.be.false;
    expect(validators.maxLength('abc', '3')).to.be.true;
    expect(validators.maxLength('abc', '4')).to.be.true;
    expect(validators.maxLength('abc')).to.be.false;
    expect(validators.maxLength(10)).to.be.false;
  });
});

describe('Pale methods testing', () => {
  it('Should be a function', () => {
    expect(!!Pale).to.be.true;
  });

  it('.run() should return Promise', () => {
    expect(new Pale({ name: ['string', 'John'] }).run()).to.instanceof(Promise);
  });

  it('.run() should return Promise', () => {
    expect(new Pale({ name: ['string', 'John'] }).run()).to.instanceof(Promise);
  });

  it('.run() should throw upon non-existent validator', async () => {
    const v = new Pale({ name: ['string i-dont-exist(2)', 'John'] });
    let status = false;

    try {
      await v.run();
      status = true;
    } catch (e) {
      status = false;
    }

    expect(status).to.be.false;
  });

  it('.run() should work upon new validator usage', async () => {
    const v = new Pale({ name: ['number ageMin(10)', '11'] });
    v.addValidator(function ageMin(value, min) {
      if (isNaN(+value)) return false;
      if (isNaN(+size)) return false;
      return +value <= +min;
    });
    let status = false;

    try {
      await v.run();
      status = true;
    } catch (e) {
      status = false;
    }

    expect(status).to.be.false;
  });
});
