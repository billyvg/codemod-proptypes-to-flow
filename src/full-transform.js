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

  const classNames = [];

  // find classes
  root = root.find(j.ClassDeclaration).forEach(p => {
    // find classes with propType static class property

    let properties;
    if (p.value.body && p.value.body.body) {
      annotateConstructor(j, p.value.body.body);
      const index = findIndex(p.value.body.body, isStaticPropType)
      if (typeof index !== 'undefined') {
        const classProperty = p.value.body.body.splice(index, 1).pop();
        properties = classProperty.value.properties;
      } else {
        // look for propTypes defined elsewhere
        const className = p.value.id;
        classNames.push(className.name);

        j(file.source).find(j.AssignmentExpression, {
          left: {
            type: 'MemberExpression',
            object: {
              name: className.name,
            },
            property: {
              name: 'propTypes',
            },
          },
          right: {
            type: 'ObjectExpression',
          },
        }).forEach(p => {
          // this should only be one?
          properties = p.value.right.properties;
        }).replaceWith(p => '');
      }

      if (properties) {
        const typeAlias = createTypeAlias(
          j, transformProperties(j, properties), {
            shouldExport: true
          }
        );

        // Find location to put propTypes flowtype definition
        // This will place ahead of class def
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
  }).toSource();

  return j(root).find(j.ExpressionStatement, {
    expression: {
      type: 'AssignmentExpression',
      left: {
        type: 'MemberExpression',
        property: {
          name: 'propTypes',
        },
      },
      right: {
        type: 'ObjectExpression',
      },
    }
  }).filter(p => classNames.indexOf(p.value.expression.left.object.name) > -1)
  .replaceWith(p => '')
  .toSource();
};
