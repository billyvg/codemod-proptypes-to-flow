import transformProperties from './helpers/transformProperties';
import createTypeAlias from './helpers/createTypeAlias.js';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  return root.find(j.VariableDeclaration)
    .replaceWith(p => {
      const flowTypes = transformProperties(j, p.value.declarations[0].init.properties);
      return createTypeAlias(j, flowTypes);
    }).toSource();
}
