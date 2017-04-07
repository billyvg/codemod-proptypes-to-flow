/* eslint-env jest */
const jscodeshift = require('jscodeshift');

const transform = require('../src/index').default;

const transformString = (source, path = 'test.js') => {
  return transform({path, source}, {jscodeshift}, {});
};

describe('React.PropTypes to flow', () => {
  it('transforms optional PropTypes prefixed with `React`', () => {
    const input = `
      import React from 'react';

      export const F = (props) =>
        <div></div>;

      F.propTypes = {
        optionalArray: React.PropTypes.array,
        optionalBool: React.PropTypes.bool,
        optionalFunc: React.PropTypes.func,
        optionalNumber: React.PropTypes.number,
        optionalObject: React.PropTypes.object,
        optionalString: React.PropTypes.string,
        optionalNode: React.PropTypes.node,
        optionalElement: React.PropTypes.element,
        optionalMessage: React.PropTypes.instanceOf(Message),
        optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
        optionalUnion: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
          React.PropTypes.instanceOf(Message)
        ]),
        optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
        optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
        optionalObjectWithShape: React.PropTypes.shape({
          color: React.PropTypes.string,
          fontSize: React.PropTypes.number
        }),
      };
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('transforms required PropTypes prefixed with `React`', () => {
    const input = `
      /* eslint */
      import React from 'react';

      function Button(props) {
        return (
          <button>
            {React.Children.toArray(children)}
          </button>
        );
      }

      Button.propTypes = {
        requiredArray: React.PropTypes.array.isRequired,
        requiredBool: React.PropTypes.bool.isRequired,
        requiredFunc: React.PropTypes.func.isRequired,
        requiredNumber: React.PropTypes.number.isRequired,
        requiredObject: React.PropTypes.object.isRequired,
        requiredString: React.PropTypes.string.isRequired,
        requiredNode: React.PropTypes.node.isRequired,
        requiredElement: React.PropTypes.element.isRequired,
        requiredMessage: React.PropTypes.instanceOf(Message).isRequired,
        requiredEnum: React.PropTypes.oneOf(['News', 'Photos']).isRequired,
        requiredUnion: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
          React.PropTypes.instanceOf(Message)
        ]).isRequired,
        requiredArrayOf: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
        requiredObjectOf: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
        requiredObjectWithShape: React.PropTypes.shape({
          color: React.PropTypes.string.isRequired,
          fontSize: React.PropTypes.number.isRequired,
        }).isRequired,
      };

      function Button2({ requiredArray }) {
        return (
          <button>
            {React.Children.toArray(children)}
          </button>
        );
      }

      Button2.propTypes = {
        requiredArray: React.PropTypes.array.isRequired,
      };
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('transforms optional PropTypes with no `React` prefix', () => {
    const input = `
      import React, { PropTypes } from 'react';

      function Button(props) {
        return (
          <button>
            {React.Children.toArray(children)}
          </button>
        );
      }

      Button.propTypes = {
        optionalArray: PropTypes.array,
        optionalBool: PropTypes.bool,
        optionalFunc: PropTypes.func,
        optionalNumber: PropTypes.number,
        optionalObject: PropTypes.object,
        optionalString: PropTypes.string,
        optionalNode: PropTypes.node,
        optionalElement: PropTypes.element,
        optionalMessage: PropTypes.instanceOf(Message),
        optionalEnum: PropTypes.oneOf(['News', 'Photos']),
        optionalUnion: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.instanceOf(Message)
        ]),
        optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
        optionalObjectOf: PropTypes.objectOf(PropTypes.number),
        optionalObjectWithShape: PropTypes.shape({
          color: PropTypes.string,
          fontSize: PropTypes.number
        }),
      };
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('transforms required PropTypes with no `React` prefix', () => {
    const input = `
      import React, { PropTypes } from 'react';

      export function Button(props) {
        return (
          <button>
            {React.Children.toArray(children)}
          </button>
        );
      }

      Button.propTypes = {
        requiredArray: PropTypes.array.isRequired,
        requiredBool: PropTypes.bool.isRequired,
        requiredFunc: PropTypes.func.isRequired,
        requiredNumber: PropTypes.number.isRequired,
        requiredObject: PropTypes.object.isRequired,
        requiredString: PropTypes.string.isRequired,
        requiredNode: PropTypes.node.isRequired,
        requiredElement: PropTypes.element.isRequired,
        requiredMessage: PropTypes.instanceOf(Message).isRequired,
        requiredEnum: PropTypes.oneOf(['News', 'Photos']).isRequired,
        requiredUnion: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.instanceOf(Message)
        ]).isRequired,
        requiredArrayOf: PropTypes.arrayOf(PropTypes.number).isRequired,
        requiredObjectOf: PropTypes.objectOf(PropTypes.number).isRequired,
        requiredObjectWithShape: PropTypes.shape({
          color: PropTypes.string.isRequired,
          fontSize: PropTypes.number.isRequired,
        }).isRequired,
      };
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('transforms PropTypes that are a class property', () => {
    const input = `
      import React from 'react';

      export default class Test extends React.Component {
        static propTypes = {
          optionalArray: React.PropTypes.array,
          optionalBool: React.PropTypes.bool,
          optionalFunc: React.PropTypes.func,
          optionalNumber: React.PropTypes.number,
          optionalObject: React.PropTypes.object,
          optionalString: React.PropTypes.string,
          optionalNode: React.PropTypes.node,
          optionalElement: React.PropTypes.element,
          optionalMessage: React.PropTypes.instanceOf(Message),
          optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
          optionalUnion: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.instanceOf(Message)
          ]),
          optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

          optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
          optionalObjectWithShape: React.PropTypes.shape({
            color: React.PropTypes.string,
            fontSize: React.PropTypes.number
          }),
          requiredFunc: React.PropTypes.func.isRequired,
          requiredAny: React.PropTypes.any.isRequired,
        };

        constructor(props) {
          super(props);
        }
      }
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('transforms PropTypes that are defined outside of class definition', () => {
    const input = `
      import React from 'react';

      export default class Test extends React.Component {
        componentDidMount() {
        }
      }

      Test.propTypes = {
        optionalArray: React.PropTypes.array,
        optionalBool: React.PropTypes.bool,
        optionalFunc: React.PropTypes.func,
        optionalNumber: React.PropTypes.number,
        optionalObject: React.PropTypes.object,
        optionalString: React.PropTypes.string,
        optionalNode: React.PropTypes.node,
        optionalElement: React.PropTypes.element,
        optionalMessage: React.PropTypes.instanceOf(Message),
        optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
        optionalUnion: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
          React.PropTypes.instanceOf(Message)
        ]),
        optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

        optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
        optionalObjectWithShape: React.PropTypes.shape({
          color: React.PropTypes.string,
          fontSize: React.PropTypes.number
        }),
        requiredFunc: React.PropTypes.func.isRequired,
        requiredAny: React.PropTypes.any.isRequired,
      };
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('adds type annotation to `prop` parameter in constructor (ES2015)', () => {
    const input = `
      /* @flow */
      import React from 'react';

      export default class Component extends React.Component {
        constructor(props) {
          super(props);
        }

        componentDidMount() {
        }
      }

      class Component2 extends React.Component {
        constructor(props) {
          super(props);
        }

        componentDidMount() {
        }
      }
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('preserves comments', () => {
    const input = `
      import React from 'react';

      function Button(props) {
        return (
          <button>
            {React.Children.toArray(children)}
          </button>
        );
      }

      Button.propTypes = {
        // You can declare that a prop is a specific JS primitive. By default, these
        // are all optional.
        optionalArray: React.PropTypes.array,
        optionalBool: React.PropTypes.bool,
        optionalFunc: React.PropTypes.func,
        optionalNumber: React.PropTypes.number,
        optionalObject: React.PropTypes.object,
        optionalString: React.PropTypes.string,

        // Anything that can be rendered: numbers, strings, elements or an array
        // (or fragment) containing these types.
        optionalNode: React.PropTypes.node,

        // A React element.
        optionalElement: React.PropTypes.element,

        // You can also declare that a prop is an instance of a class. This uses
        // JS's instanceof operator.
        optionalMessage: React.PropTypes.instanceOf(Message),

        // You can ensure that your prop is limited to specific values by treating
        // it as an enum.
        optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

        // An object that could be one of many types
        optionalUnion: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
          React.PropTypes.instanceOf(Message)
        ]),

        // An array of a certain type
        optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

        // An object with property values of a certain type
        optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

        // An object taking on a particular shape
        optionalObjectWithShape: React.PropTypes.shape({
          color: React.PropTypes.string,
          fontSize: React.PropTypes.number
        }),

        // You can chain any of the above with \`isRequired\` to make sure a warning
        // is shown if the prop isn't provided.
        requiredFunc: React.PropTypes.func.isRequired,

        // A value of any data type
        requiredAny: React.PropTypes.any.isRequired,
      };
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('add empty PropTypes (no constructor)', () => {
    const input = `
      import React from 'react';
      import { View } from 'react-native';

      class Cards extends React.Component {
        render() {
          return (
            <View />
          );
        }
      }

      export default Cards;
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('adds empty PropTypes (constructor)', () => {
    const input = `
      import { Component } from 'react';
      import { View } from 'react-native';
      import PureRenderMixin from 'react-addons-pure-render-mixin';

      class PureComponent extends Component {
        constructor(props) {
          super(props);

          this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        }
        render() {
          return (
            <View />
          );
        }
      }

      export default PureComponent;
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

  it('does not touch non React classes', () => {
    const input = `
      class PureComponent extends Class {
        constructor() {
        }
      }

      export default PureComponent;
    `;

    expect(transformString(input)).toMatchSnapshot();
  });

});
