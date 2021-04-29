function setProps(node, props) {
  Object.keys(props).map((key) => {
    // 先实现onClick，真正的react自己有实现一套自己的事件机制，并非直接挂载在node上
    if (key === 'onClick') {
      node.onclick = props[key];
    } else if (key === 'style') {
      const { style } = props;
      for (const styleName in style) {
        node.style[styleName] = style[styleName];
      }
    } else {
      if (props[key]) {
        node.setAttribute(key, props[key]);
      } else {
        noderemoveAttribute(key);
      }
    }
  });
}

const renderFunctionComponent = (vnode, root) => {
  const { props, children, tag: Construct, instance } = vnode;
  let component;
  if (instance) {
    component = instance;
  } else {
    component = new Construct({ children, ...props});
    component._construct = Construct;
    component.root = root;
    vnode.instance = component;
  }
  const jsx = component.render();
  return jsx;
}

export let rerender = () => {};



export const render = (vnode, container) => {
  const rootElement = vnode;
  rootElement.isUpdating = true;
  function _render(vnode, _container) {
    if (typeof vnode === 'boolean' || vnode === undefined || vnode === null ) {
      vnode = '';
    }
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      const dom = document.createTextNode(`${vnode}`);
      return _container ? _container.appendChild(dom) : dom;
    }

    if (typeof vnode.tag === 'function') {
      const { tag: Construct, props, children } = vnode;
      let jsxNode;
      if (Construct.prototype.render) {
        jsxNode = renderFunctionComponent(vnode, rootElement);
      } else {
        jsxNode = vnode.tag({ children, ...props});
      }
      return _container ? _container.appendChild(_render(jsxNode)) : _render(jsxNode);
    }

    const dom = document.createElement(vnode.tag);
    if (vnode.props) {
      setProps(dom, vnode.props);
    }
    vnode.children.flat().map((children) => _render(children, dom));
    return _container ? _container.appendChild(dom) : dom;
  }
  container.innerHTML = '';
  container.appendChild(_render(vnode));
  rootElement.isUpdating = false;
  rerender = (vnode) => { render(vnode, container); };
}
