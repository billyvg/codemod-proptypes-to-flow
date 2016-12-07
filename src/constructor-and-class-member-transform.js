import annotateConstructor from './helpers/annotateConstructor';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

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
}
