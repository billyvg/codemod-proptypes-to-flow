export default function createTypeAlias(j, flowTypes, { name, export } = { name: 'Props', export: false }) {
  const typeAlias = j.typeAlias(
    j.identifier(name), null, j.objectTypeAnnotation(flowTypes)
  );

  if (export) {
    return j.exportNamedDeclaration(typeAlias);
  }

  return typeAlias;
}
