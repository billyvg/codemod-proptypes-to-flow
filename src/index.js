import transformEs6ClassComponents from './transformers/es6Classes';
import transformFunctionalComponents from './transformers/functional';

function addFlowComment(j, ast) {
  const getBodyNode = () => ast.find(j.Program).get('body', 0).node;

  const comments = getBodyNode().comments || [];
  const containsFlowComment = comments
    .filter(e => e.value.indexOf('@flow') !== -1)
    .length > 0;

  if (!containsFlowComment) {
    comments.unshift(j.commentBlock(' @flow '));
  }

  getBodyNode().comments = comments;
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const classModifications = transformEs6ClassComponents(root, j);
  const functionalModifications = transformFunctionalComponents(root, j);

  if (classModifications || functionalModifications) {
    addFlowComment(j, root);
    return root.toSource({quote: 'single', trailingComma: true });
  } else {
    return file.source;
  }
}
