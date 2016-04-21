import React from 'react';

export type Props = {
  optionalArray?: Array<any>;
  optionalBool?: boolean;
  optionalFunc?: Function;
  optionalNumber?: number;
  optionalObject?: Object;
  optionalString?: string;
  optionalNode?: number | string | React.Element | Array<any>;
  optionalElement?: React.Element;
  optionalMessage?: Message;
  optionalEnum?: "News" | "Photos";
  optionalUnion?: string | number | Message;
  optionalArrayOf?: Array<number>;
  optionalObjectOf?: Object<number>;
  optionalObjectWithShape?: {
    color?: string;
    fontSize?: number;
  };
  requiredFunc: Function;
  requiredAny: any;
};

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }
}
