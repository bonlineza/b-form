/** @format */

// @flow
function hasOwn(object, name) {
  if (!object) return false;
  return Object.prototype.hasOwnProperty.call(object, name);
}

export default function sanitizeStore(store) {
  return store.reduce((acc, curr) => {
    let next = {};

    if (
      hasOwn(curr, 'input') &&
      curr.input !== null &&
      curr.input.checked &&
      (curr.input.type === 'checkbox' ||
        (hasOwn(curr.input || {}, 'props') &&
          curr.input.props.type === 'checkbox'))
    ) {
      // checkbox
      const target = curr.name.split('-')[0];
      const value = hasOwn(curr.input || {}, 'props')
        ? curr.input.state.checked
        : curr.input.value;

      next = {
        [target]:
          acc[target] && acc[target].length > 0
            ? [...acc[target], curr.input.value]
            : [value],
      };
    } else if (
      hasOwn(curr, 'input') &&
      curr.input !== null &&
      hasOwn(curr.input, 'checked')
    ) {
      // radio or similar
      next = {
        // -- remove what we append to the label `...-${number}`
        [curr.name
          .split('-')
          .slice(0, -1)
          .join('-')]: curr.input.checked ? curr.input.value : null,
      };
    } else if (hasOwn(curr, 'input') && curr.input !== null) {
      // normal element
      next = {
        [curr.name]: curr.input.value || null,
      };
    } else {
      // this is some custom element
      next = {
        [curr.name]: curr.value !== undefined ? curr.value : null,
      };
    }

    const [checkKey] = Object.keys(next);

    if (next[checkKey] === undefined || next[checkKey] === null) {
      next = {};
    }
    return { ...acc, ...next };
  }, {});
}
