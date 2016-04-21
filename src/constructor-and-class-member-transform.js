import transformProperties from './helpers/transformProperties';
import createTypeAlias from './helpers/createTypeAlias';
import findParentBody from './helpers/findParentBody';
import annotateConstructor from './helpers/annotateConstructor';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;

  let root = j(file.source);

  // find classes
  return root.find(j.ClassDeclaration)
    .forEach(p => {
      // find classes with propType static class property
      if (p.value.body && p.value.body.body) {
        annotateConstructor(j, p.value.body.body);
      }
    })
    .map(p => {
      return p;
    }).toSource();
};
