import transformProperties from './helpers/transformProperties';
import createTypeAlias from './helpers/createTypeAlias';
import findParentBody from './helpers/findParentBody';
import annotateConstructor from './helpers/annotateConstructor';
import findIndex from './helpers/findIndex';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;
  let root = j(file.source);

  const isStaticPropType = (p) => {
    return p.type === 'ClassProperty' &&
      p.static &&
      p.key.type === 'Identifier' &&
      p.key.name === 'propTypes';
  };

  // find classes
  return root.find(j.ClassDeclaration)
    .forEach(p => {
      // find classes with propType static class property
      if (p.value.body && p.value.body.body) {
        const index = findIndex(p.value.body.body, isStaticPropType)
        if (typeof index !== 'undefined') {
          const classProperty = p.value.body.body.splice(index, 1).pop();
          const typeAlias = createTypeAlias(
            j, transformProperties(j, classProperty.value.properties), {
              shouldExport: true
            }
          );

          // find parent
          const {
            child,
            body,
          } = findParentBody(p);
          if (body && child) {
            const bodyIndex = findIndex(body.value, (b) => b === child);
            if (bodyIndex) {
              body.value.splice(bodyIndex, 0, typeAlias);
            }
          }
          return p;
        }
      }
    })
    .map(p => {
      return p;
    }).toSource();
};
