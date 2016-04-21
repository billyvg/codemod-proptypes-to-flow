export default function propTypeToFlowType(j, key, value) {
  /**
   * Returns an expression without `isRequired`
   * @param {Node} node NodePath Should be the `value` of a `Property`
   * @return {Object} Object with `required`, and `node`
   */
  const getExpressionWithoutRequired = (inputNode) => {
    // check if it's required
    let required = false;
    let node = inputNode;

    if (inputNode.property && inputNode.property.name === 'isRequired') {
      required = true;
      node = inputNode.object;
    }

    return {
      required,
      node,
    };
  };

  /**
   * Gets the PropType MemberExpression without `React` namespace
   */
  const getPropTypeExpression = (inputNode) => {
    const base = inputNode.callee || inputNode.object;

    if (inputNode.object &&
        inputNode.object.object &&
        inputNode.object.object.name === 'React') {
      return j.memberExpression(
        inputNode.object.property,
        inputNode.property
      );
    } else if (inputNode.object && inputNode.object.name === 'React') {
      return inputNode.property;
    }
    return inputNode;
  };

  const TRANSFORM_MAP = {
    any: j.anyTypeAnnotation(),
    bool: j.booleanTypeAnnotation(),
    func: j.genericTypeAnnotation(j.identifier('Function'), null),
    number: j.numberTypeAnnotation(),
    object: j.genericTypeAnnotation(j.identifier('Object'), null),
    string: j.stringTypeAnnotation(),
    str: j.stringTypeAnnotation(),
    array: j.genericTypeAnnotation(
      j.identifier('Array'), j.typeParameterInstantiation(
        [j.anyTypeAnnotation()]
      )
    ),
    element: j.genericTypeAnnotation(
      j.qualifiedTypeIdentifier(j.identifier('React'), j.identifier('Element')),
      null
    ),
    node: j.unionTypeAnnotation([
      j.numberTypeAnnotation(),
      j.stringTypeAnnotation(),
      j.genericTypeAnnotation(
        j.qualifiedTypeIdentifier(j.identifier('React'), j.identifier('Element')),
        null
      ),
      j.genericTypeAnnotation(
        j.identifier('Array'), j.typeParameterInstantiation(
          [j.anyTypeAnnotation()]
        )
      ),
    ]),
  };
  let returnValue;

  let required;
  let node;

  // XXX: couldn't find how to enable stage-0 with jest
  let expressionWithoutRequired = getExpressionWithoutRequired(value);
  required = expressionWithoutRequired.required;
  node = expressionWithoutRequired.node;

  // Check for React namespace for MemberExpressions (i.e. React.PropTypes.string)
  if (node.object) {
    node.object = getPropTypeExpression(node.object);
  } else if (node.callee) {
    node.callee = getPropTypeExpression(node.callee);
  }


  if (node.type === 'Literal') {
    returnValue = j.stringLiteralTypeAnnotation(node.value, node.raw);
  } else if (node.type === 'MemberExpression') {
    returnValue = TRANSFORM_MAP[node.property.name];
  } else if (node.type === 'CallExpression') {
    // instanceOf(), arrayOf(), etc..
    const name = node.callee.property.name;
    if (name === 'instanceOf') {
      returnValue = j.genericTypeAnnotation(node.arguments[0], null);
    } else if (name === 'arrayOf') {
      returnValue = j.genericTypeAnnotation(
        j.identifier('Array'), j.typeParameterInstantiation(
          [propTypeToFlowType(j, null, node.arguments[0] || j.anyTypeAnnotation())]
        )
      );
    } else if (name === 'objectOf') {
      // TODO: Is there a direct Flow translation for this?
      returnValue = j.genericTypeAnnotation(
        j.identifier('Object'), j.typeParameterInstantiation(
          [propTypeToFlowType(j, null, node.arguments[0] || j.anyTypeAnnotation())]
        )
      );
    } else if (name === 'shape') {
      returnValue = j.objectTypeAnnotation(
        node.arguments[0].properties.map(arg => propTypeToFlowType(j, arg.key, arg.value))
      );
    } else if (name === 'oneOfType' || name === 'oneOf') {
      returnValue = j.unionTypeAnnotation(
        node.arguments[0].elements.map(arg => propTypeToFlowType(j, null, arg))
      );
    }
  } else if (node.type === 'ObjectExpression') {
    returnValue = j.objectTypeAnnotation(
      node.arguments.map(arg => propTypeToFlowType(j, arg.key, arg.value))
    );
  } else if (node.type === 'Identifier') {
    returnValue = j.genericTypeAnnotation(node, null);
  }

  // finally return either an objectTypeProperty or just a property if `key` is null
  if (!key) {
    return returnValue;
  } else {
    return j.objectTypeProperty(key, returnValue, !required);
  }
}
