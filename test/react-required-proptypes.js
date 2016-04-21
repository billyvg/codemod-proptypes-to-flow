const propTypes = {
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
