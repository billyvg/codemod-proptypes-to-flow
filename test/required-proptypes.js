const propTypes = {
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
