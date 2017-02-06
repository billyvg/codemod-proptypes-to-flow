import propTypeToFlowType from '../helpers/propTypeToFlowType';

function removeComponentAssignmentPropTypes(ast, j) {
  const componentToPropTypesRemoved = {};

  ast.find(j.AssignmentExpression, {
    left: {
      property: {
        name: 'propTypes',
      },
    },
  }).forEach(p => {
    const objectName = p.value.left.object.name;
    const properties = p.value.right.properties;
    const flowTypesRemoved = properties.map(property => {
      const t = propTypeToFlowType(j, property.key, property.value);
      t.comments = property.comments;
      return t;
    });

    componentToPropTypesRemoved[objectName] = flowTypesRemoved;
  })
  .remove();

  return componentToPropTypesRemoved;
}

function insertTypeIdentifierInFunction(functionPath, j, typeIdentifier) {
  const functionRoot = functionPath.value.init || functionPath.value;

  const params = functionRoot.params;
  const param = params[0];

  const newTypeAnnotation = j.typeAnnotation(
    j.genericTypeAnnotation(j.identifier(typeIdentifier), null)
  );

  if (param.type === 'Identifier') {
    param.typeAnnotation = newTypeAnnotation;
  } else if (param.type === 'ObjectPattern') {
    // NOTE: something is wrong with recast and objectPatterns...
    // You cannot set typeAnnotation on them, do object spread instead

    const newProps = j.identifier('props');
    newProps.typeAnnotation = newTypeAnnotation;
    functionRoot.params = [newProps];
    const newSpread = j.variableDeclaration(
      'const',
      [j.variableDeclarator(param, j.identifier('props'))]
    );
    functionRoot.body.body.unshift(newSpread);
  }
}

/**
 * Transforms function components
 * @return true if any functional components were transformed.
 */
export default function transformFunctionalComponents(ast, j) {
  // Look for Foo.propTypes
  const componentToPropTypesRemoved = removeComponentAssignmentPropTypes(ast, j);
  const components = Object.keys(componentToPropTypesRemoved);

  if (components.length === 0) {
    return null;
  }

  components.forEach(c => {
    const flowTypesRemoved = componentToPropTypesRemoved[c];
    const propIdentifier = components.length === 1 ? 'Props' : `${c}Props`;
    const flowTypeProps = j.exportNamedDeclaration(j.typeAlias(
       j.identifier(propIdentifier), null, j.objectTypeAnnotation(flowTypesRemoved)
     ));

    ast.find(j.FunctionDeclaration, {
      id: { name: c },
    })
    .forEach(f => {
      const insertNode = f.parent.node.type === 'Program' ? f : f.parent;
      insertNode.insertBefore(flowTypeProps);
      insertTypeIdentifierInFunction(f, j, propIdentifier);
    });

    ast.find(j.VariableDeclarator, {
      id: { name: c },
    })
    .forEach(f => {
      const insertNode = f.parent.parent.node.type === 'Program' ? f.parent : f.parent.parent;
      insertNode.insertBefore(flowTypeProps);
      insertTypeIdentifierInFunction(f, j, propIdentifier);
    });
  });

  return components.length > 0;
}
