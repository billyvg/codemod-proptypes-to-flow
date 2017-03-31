/* @flow */
/* eslint */
import React from 'react';

export type ButtonProps = {
  requiredArray: Array<any>,
  requiredBool: boolean,
  requiredFunc: Function,
  requiredNumber: number,
  requiredObject: Object,
  requiredString: string,
  requiredNode: number | string | React.Element | Array<any>,
  requiredElement: React.Element,
  requiredMessage: Message,
  requiredEnum: 'News' | 'Photos',
  requiredUnion: string | number | Message,
  requiredArrayOf: Array<number>,
  requiredObjectOf: Object<number>,
  requiredObjectWithShape: {
    color: string,
    fontSize: number,
  },
};

function Button(props: ButtonProps) {
  return (
    <button>
      {React.Children.toArray(children)}
    </button>
  );
}

export type Button2Props = { requiredArray: Array<any> };

function Button2(props: Button2Props) {
  const { requiredArray } = props;
  return (
    <button>
      {React.Children.toArray(children)}
    </button>
  );
}
