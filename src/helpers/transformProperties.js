import propTypeToFlowType from './propTypeToFlowType';

export default function transformProperties(j, properties) {
  return properties.map(property => {
    const type = propTypeToFlowType(j, property.key, property.value);
    type.value.leadingComments = property.leadingComments;
    type.value.comments = property.comments;
    return type;
  });
}

