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

// 渲染非函数和非类组件
function renderNormalElement(vnode) {
  let dom;
  if (typeof vnode === 'boolean' || vnode === undefined || vnode === null) {
    vnode = '';
  } else if (typeof vnode === 'string' || typeof vnode === 'number') {
    dom = document.createTextNode(vnode);
  } else if (vnode.tag) {
    dom = document.createElement(vnode.tag);
    setProps(dom, vnode.props || {});
  } else {
    throw new Error('未知元素', vnode);
  }
  return dom;
}

export const render = (vnode, container) => {
  const rootElement = vnode;
  rootElement.isUpdating = true;
  function _render(vnode, container) {
    let dom;
    if (typeof vnode.tag === 'function') {
      const { tag: Construct, props, children } = vnode;
      if (Construct.prototype.render) {
        vnode = renderFunctionComponent(vnode, rootElement);
      } else {
        vnode = vnode.tag({ children, ...props});
      }
      dom = _render(vnode);
    } else {
      dom = renderNormalElement(vnode);
    }
    (vnode.children || []).map((childrenNode) => {
      if (Array.isArray(childrenNode)) {
        childrenNode.map((node) => _render(node, dom));
        return;
      }
      _render(childrenNode, dom);
    });
    if (container) {
      container.appendChild(dom);
    }
    return dom;
  }
  container.innerHTML = '';
  container.appendChild(_render(vnode));
  rootElement.isUpdating = false;
  rerender = (vnode) => { render(vnode, container); };
}
