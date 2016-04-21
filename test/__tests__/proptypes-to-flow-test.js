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

  //it('transforms PropTypes with comments', () => {
    //test('simple-transform', 'proptypes-with-comments');
  //});
});
