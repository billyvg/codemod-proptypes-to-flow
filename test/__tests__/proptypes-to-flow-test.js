'use strict';

const fs = require('fs');
const p = require('path');

const read = fileName => fs.readFileSync(
  p.join(__dirname, '..', fileName),
  'utf8'
);

const test = (transformName, testFileName, options, fakeOptions) => {
  const jscodeshift = require('jscodeshift');
  const source = read(testFileName + '.js');
  const output = read(testFileName + '.output.js');
  let path = testFileName + '.js';
  let transform = require(
    p.join(p.join(__dirname, '../../src'), transformName)
  );
  if (transform.default) {
    transform = transform.default;
  }

  if (fakeOptions && fakeOptions.path) {
    path = fakeOptions.path;
  }

  expect(
    (transform({path, source}, {jscodeshift}, options || {}) || '').trim()
  ).toEqual(
    output.trim()
  );
};

describe('React.PropTypes to flow', () => {
  it('transforms optional PropTypes prefixed with `React`', () => {
    test('simple-transform', 'react-optional-proptypes');
  });

  it('transforms required PropTypes prefixed with `React`', () => {
    test('simple-transform', 'react-required-proptypes');
  });

  it('transforms optional PropTypes with no `React` prefix', () => {
    test('simple-transform', 'optional-proptypes');
  });

  it('transforms required PropTypes with no `React` prefix', () => {
    test('simple-transform', 'required-proptypes');
  });

  it('transforms PropTypes that are a class property', () => {
    test('static-properties-transform', 'class-property-proptypes');
  });

  it('transforms PropTypes that are fined outside of class definition', () => {
    test('full-transform', 'member-proptypes');
  });

  it('Adds type annotation to `prop` parameter in constructor (ES2015)', () => {
    test('constructor-and-class-member-transform', 'constructor-and-class-member-annotation');
  });
});
