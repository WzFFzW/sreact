export const createElement = (tag, props, ...children) => {
  return {
    tag,
    props,
    children,
  }
};