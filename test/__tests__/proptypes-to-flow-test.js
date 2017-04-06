/* eslint-env jest */
const fs = require('fs');
const p = require('path');
const jscodeshift = require('jscodeshift');

const transform = require('../../src/index').default;

const read = fileName => fs.readFileSync(
  p.join(__dirname, '..', fileName),
  'utf8'
);

const transformString = (source, path = 'test.js') => {
  return transform({path, source}, {jscodeshift}, {});
};

const test = (testFileName, options) => {
  // TODO: we could just use snapshot testing...
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

  it('Does not touch files without PropTypes', () => {
    // TODO: Maybe add @flow type
    const input = `
      import React from 'react';
      import { View } from 'react-native';
      import PureComponent from './PureComponent';

      class Cards extends PureComponent {
        render() {
          return (
            <View />
          );
        }
      }

      export default Cards;
    `;

    expect(transformString(input)).toEqual(input);
  });

  it('Does not touch files without PropTypes (constructor)', () => {
    // TODO: Maybe add @flow type
    const input = `
      import { Component } from 'react';
      import PureRenderMixin from 'react-addons-pure-render-mixin';

      class PureComponent extends Component {
        constructor(props) {
          super(props);

          this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        }
      }

      export default PureComponent;
    `;

    expect(transformString(input)).toEqual(input);
  });

});
