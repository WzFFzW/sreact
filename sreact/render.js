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


export const render = (vnode, container) => {
  function _render(vnode, _container) {
    if (typeof vnode === 'boolean' || !vnode ) {
      vnode = '';
    }
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      const dom = document.createTextNode(vnode);
      return _container ? _container.appendChild(dom) : dom;
    }

    const dom = document.createElement(vnode.tag);
    if (vnode.props) {
      setProps(dom, vnode.props);
    }
    vnode.children.map((children) => _render(children, dom));
    return _container ? _container.appendChild(dom) : dom;
  }
  container.innerHTML = '';
  container.appendChild(_render(vnode));
}