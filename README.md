# codemod-proptypes-to-flow [![Build Status](https://travis-ci.org/billyvg/codemod-proptypes-to-flow.svg?branch=master)](https://travis-ci.org/billyvg/codemod-proptypes-to-flow)
Removes React.PropTypes and attempts to transform to flowtypes. Currently only supports `propTypes` defined as static class properties using ES2015 classes.

### Setup & Run
  * `npm install -g jscodeshift`
  * `git clone https://github.com/billyvg/codemod-proptypes-to-flow` 
  * `jscodeshift -t <codemod-script> <path>`
  * Use the `-d` option for a dry-run and use `-p` to print the output
    for comparison

### Not working/Implemented yet
  * Custom validators
  * `React.createClass`
  * Stateless functions
