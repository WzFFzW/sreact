const FunComponentType = Symbol('functionComponent');
const ClassComponentType = Symbol('classComponent');

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

const renderClassComponent = (vnode, root) => {
  const { props, children, tag: Construct, instance, dom } = vnode;
  let component;
  if (instance) {
    const {
      componentWillReceiveProps, componentWillUpdate, componentDidUpdate,
      shouldComponentUpdate, updaterQueue = [], state, props: preProps,
    } = instance;
    // 合并state
    const updaterCb = updaterQueue.map(({ cb }) => cb);
    const nextState = updaterQueue.reduce((pre, { state: _state }) => {
      if (typeof _state === 'function') {
        _state = _state(pre, preProps);
      }
      return { ...pre, ..._state };
    }, { ...state });
    componentWillReceiveProps?.call(instance, props, nextState);
    instance.state = nextState;
    if (shouldComponentUpdate?.call(instance, props, nextState)) {
      return dom;
    };
    componentWillUpdate?.call(instance, props, state)
    component = instance;
    component.props = props;
  } else {
    component = new Construct({ children, ...props});
    component.isMounted = true;
    component._construct = Construct;
    component.root = root;
    vnode.instance = component;
    component?.componentWillMount();
  }
  vnode.jsx = component.render();
  return vnode;
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
      const { tag: Construct, props, children, instance } = vnode;
      let isMounted = false;
      if (instance?.isMounted) {
        isMounted = true;
      }
      if (Construct.prototype.render) {
        renderClassComponent(vnode, rootElement);
        vnode.type = ClassComponentType;
      } else {
        vnode.jsx = vnode.tag({ children, ...props});
        vnode.type = FunComponentType;
      }
      dom = _render(vnode.jsx, container);
      if (vnode.type === ClassComponentType && vnode?.instance) {
        if (isMounted) {
          vnode.instance?.componentDidUpdate();
        } else {
          vnode.instance?.componentDidMount();
        }
      }
      return dom;
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
