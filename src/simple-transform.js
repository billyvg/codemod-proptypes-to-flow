import propTypeToFlowType from './propTypeToFlowType';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;
  let flowTypes;
  let root = j(file.source);

  return root.find(j.VariableDeclaration)
    .replaceWith(p => {
      const flowTypes = p.value.declarations[0].init.properties.map(property => {
          const type = propTypeToFlowType(j, property.key, property.value);
          type.value.leadingComments = property.leadingComments;
          type.value.comments = property.comments;
          return type;
      });
      return j.typeAlias(
        j.identifier('Props'), null, j.objectTypeAnnotation(flowTypes)
      );
    })
    .toSource();
};
