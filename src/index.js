import propTypeToFlowType from './helpers/propTypeToFlowType';

export default function transformer(file, api) {
  const j = api.jscodeshift;

  let root = j(file.source);
  const requiredProps = new Set();

  let nonStaticQuery;
  const staticPropsQuery = root.find(j.ClassProperty, {
    key: {
      type: 'Identifier',
      name: 'propTypes',
    },
  });

  const hasStaticProps = staticPropsQuery.size();
  if (hasStaticProps) {
  // Replace React.PropTypes
    root = staticPropsQuery.replaceWith(p => {
      if (p && p.value && p.value.value) {
        j(p.value.value).find(j.MemberExpression, {
          property: {
            type: 'Identifier',
            name: 'isRequired',
          },
        }).replaceWith(p => {
          requiredProps.add(
          p.parentPath.value.key.name
        );

          return p.value.object;
        }).toSource();
        p.value.value.properties.map((prop) => {
          return j(prop).find(j.MemberExpression, {
            object: {
              type: 'Identifier',
              name: 'React',
            },
            property: {
              type: 'Identifier',
              name: 'PropTypes',
            },
          }).replaceWith(p => p.value.property);
        });
      }
      return p.value;
    }).toSource();

  } else {

    nonStaticQuery = j(file.source).find(j.AssignmentExpression, {
      left: {
        property: {
          name: 'propTypes',
        },
      },
    });

    root = nonStaticQuery.replaceWith(p => {
      if (p && p.value && p.value.right) {
        j(p.value.right.properties).find(j.MemberExpression, {
          property: {
            type: 'Identifier',
            name: 'isRequired',
          },
        }).replaceWith(p => {
          requiredProps.add(
            p.parentPath.value.key.name
          );

          return p.value.object;
        }).toSource();
        p.value.right.properties.map((prop) => {
          return j(prop).find(j.MemberExpression, {
            object: {
              type: 'Identifier',
              name: 'React',
            },
            property: {
              type: 'Identifier',
              name: 'PropTypes',
            },
          }).replaceWith(p => p.value.property);
        });
      }
      return p.value;
    }).toSource();
  }


  // Look for propTypes

  let flowTypes;
  const query = hasStaticProps ?
    j(root)
    .find(j.ClassProperty, {
      key: {
        name: 'propTypes',
      },
    })
    :
    j(root).find(j.AssignmentExpression, {
      left: {
        property: {
          name: 'propTypes',
        },
      },
    });


  root = query.forEach(
    p => {
      const properties = hasStaticProps ? p.value.value.properties :
      p.value.right.properties;

      flowTypes = properties.map(property => {
        const t = propTypeToFlowType(j, property.key, property.value);
        t.comments = property.comments;
        return t;
      });
    }
  )
  .replaceWith(p => '')
  .toSource();

  if (flowTypes) {
    const flowTypeProps = j.exportNamedDeclaration(j.typeAlias(
      j.identifier('Props'), null, j.objectTypeAnnotation(flowTypes)
    ));

    return j(root).forEach(p => {
      let index;
      p.value.program.body.filter((p, i) => {
        let found;
        const classExpression = j(p).find(j.ClassDeclaration);
        if (classExpression.size()) {
          index = i;
          found = classExpression;
        } else if (p.type === 'ClassDeclaration') {
          index = i;
          found = p;
        }
        let propTypeAnnotationIndex = 0;

        if (found) {
          // found our class declaration, lets find constructor
          found.body.body.some((b, i) => {
            if (b.kind === 'constructor') {
              propTypeAnnotationIndex = i + 1;
              b.value.params
              .forEach(param => {
                if (param.name === 'props') {
                  param.typeAnnotation = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Props'), null));
                }
              });
              return true;
            }
          });
          found.body.body.splice(
            propTypeAnnotationIndex,
            0,
            j.classProperty(
              j.identifier('props'),
              null,
              j.typeAnnotation(
                j.genericTypeAnnotation(j.identifier('Props'), null)
              )
            )
          );
        }
        return found;
      });
      p.value.program.body.splice(index, 0, flowTypeProps);
    }).toSource({quote: 'single', trailingComma: true });
  } else {
    return j(root).toSource({quote: 'single' });
  }
}
