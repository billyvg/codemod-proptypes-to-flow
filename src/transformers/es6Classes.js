import annotateConstructor from '../helpers/annotateConstructor';
import createTypeAlias from '../helpers/createTypeAlias';
import findIndex from '../helpers/findIndex';
import findParentBody from '../helpers/findParentBody';
import transformProperties from '../helpers/transformProperties';

const isStaticPropType = (p) => {
  return p.type === 'ClassProperty' &&
    p.static &&
    p.key.type === 'Identifier' &&
    p.key.name === 'propTypes';
};

/**
 * Transforms es2016 components
 * @return true if any components were transformed.
 */
export default function transformEs6Classes(ast, j) {
  const classNames = [];

  // TODO: find only React classes
  const reactClassPaths = ast.find(j.ClassDeclaration);

  reactClassPaths.forEach(p => {
    // find classes with propType static class property
    const className = p.value.id.name;
    const propIdentifier = reactClassPaths.length === 1 ? 'Props' : `${className}Props`;
    let properties;

    if (p.value.body && p.value.body.body) {
      annotateConstructor(j, p.value.body.body, propIdentifier);
      const index = findIndex(p.value.body.body, isStaticPropType);
      if (typeof index !== 'undefined') {
        const classProperty = p.value.body.body.splice(index, 1).pop();
        properties = classProperty.value.properties;
      } else {
        // look for propTypes defined elsewhere
        const className = p.value.id;
        classNames.push(className.name);

        ast.find(j.AssignmentExpression, {
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
        })
        .forEach(p => {
          // this should only be one?
          properties = p.value.right.properties;
        })
        .remove();
      }

      properties = properties || [];
      const typeAlias = createTypeAlias(
        j, transformProperties(j, properties), {
          name: propIdentifier,
          shouldExport: true,
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
    }
  });

  ast.find(j.ExpressionStatement, {
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
    },
  })
  .filter(p => classNames.indexOf(p.value.expression.left.object.name) > -1)
  .remove();

  return reactClassPaths.length > 0;
}
