/**
 * Annotates ES2015 Class constructor and Class `props` member
 *
 * @param {jscodeshiftApi} j jscodeshift API
 * @param {Array} body Array of `Node`
 */
export default function annotateConstructor(j, body, name = 'Props') {
  const type = j.genericTypeAnnotation(
    j.identifier(name),
    null
  );

  if (body.superClass && !body.superTypeParameters) {
    body.superTypeParameters = j.typeParameterInstantiation([type]);
  }
}
