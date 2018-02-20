import transformEs6ClassComponents from './transformers/es6Classes';
import transformFunctionalComponents from './transformers/functional';
import ReactUtils from './helpers/ReactUtils';

function addFlowComment(j, ast, options) {
  const getBodyNode = () => ast.find(j.Program).get('body', 0).node;

  const comments = getBodyNode().comments || [];
  const containsFlowComment =
    comments.filter(e => e.value.indexOf('@flow') !== -1).length > 0;

  if (!containsFlowComment) {
    switch (options.flowComment) {
      case 'line':
        comments.unshift(j.commentLine(' @flow'));
        break;
      case 'block':
      default:
        comments.unshift(j.commentBlock(' @flow '));
        break;
    }
  }

  getBodyNode().comments = comments;
}

export default function transformer(file, api, rawOptions) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const options = rawOptions;
  if (options.flowComment !== 'line' && options.flowComment !== 'block') {
    if (options.flowComment) {
      console.warn(
        `Unsupported flowComment value provided: ${options.flowComment}`
      );
      console.warn('Supported options are "block" and "line".');
      console.warn('Falling back to default: "block".');
    }
    options.flowComment = 'block';
  }
  if (!options.propsTypeSuffix) {
    options.propsTypeSuffix = 'Props';
  }

  const reactUtils = ReactUtils(j);
  if (!reactUtils.hasReact(root)) {
    return file.source;
  }

  const classModifications = transformEs6ClassComponents(root, j, options);
  const functionalModifications = transformFunctionalComponents(
    root,
    j,
    options
  );

  if (classModifications || functionalModifications) {
    addFlowComment(j, root, options);
    return root.toSource({ quote: 'single', trailingComma: true });
  } else {
    return file.source;
  }
}
