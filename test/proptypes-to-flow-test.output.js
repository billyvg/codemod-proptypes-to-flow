import React from 'react';

export type Props = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  optionalArray?: Array<any>;
  optionalBool?: boolean;
  optionalFunc?: Function;
  optionalNumber?: number;
  optionalObject?: Object;
  optionalString?: string;

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode?: number | string | React.Element | Array<any>;

  // A React element.
  optionalElement?: React.Element;

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage?: Message;

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum?: "News" | "Photos";

  // An object that could be one of many types
  optionalUnion?: string | number | Message;

  // An array of a certain type
  optionalArrayOf?: Array<number>;

  // An object with property values of a certain type
  optionalObjectOf?: Object<number>;

  // An object taking on a particular shape
  optionalObjectWithShape?: {
    color?: string,
    fontSize: number,
  };

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: Function;

  // A value of any data type
  requiredAny: any;
};

export default class Test extends React.Component {
  constructor(props: Props) {
    super(props);
  }
}
