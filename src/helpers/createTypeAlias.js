export default function createTypeAlias(j, flowTypes, { name = 'Props', shouldExport = false } = {}) {
  const typeAlias = j.typeAlias(
    j.identifier(name), null, j.objectTypeAnnotation(flowTypes)
  );

  if (shouldExport) {
    return j.exportNamedDeclaration(typeAlias);
  }

  return typeAlias;
}
