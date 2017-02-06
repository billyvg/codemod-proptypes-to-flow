/* eslint-env jest */
const fs = require('fs');
const p = require('path');
const jscodeshift = require('jscodeshift');

const transform = require('../../src/index').default;

const read = fileName => fs.readFileSync(
  p.join(__dirname, '..', fileName),
  'utf8'
);

const test = (testFileName, options) => {
  const source = read(`${testFileName}.js`);
  const output = read(`${testFileName}.output.js`);
  const path = `${testFileName}.js`;

  expect(
    (transform({path, source}, {jscodeshift}, {}) || '').trim()
  ).toEqual(
    output.trim()
  );
};

describe('React.PropTypes to flow', () => {
  it('transforms optional PropTypes prefixed with `React`', () => {
    test('react-optional-proptypes');
  });

  it('transforms required PropTypes prefixed with `React`', () => {
    test('react-required-proptypes');
  });

  it('transforms optional PropTypes with no `React` prefix', () => {
    test('optional-proptypes');
  });

  it('transforms required PropTypes with no `React` prefix', () => {
    test('required-proptypes');
  });

  it('transforms PropTypes that are a class property', () => {
    test('class-property-proptypes');
  });

  it('transforms PropTypes that are defined outside of class definition', () => {
    test('member-proptypes');
  });

  it('Adds type annotation to `prop` parameter in constructor (ES2015)', () => {
    test('constructor-and-class-member-annotation');
  });
});
