import { rerender } from './render';

class Updater {
  queue = [];
  timeout

  flushQueue(root) {
    const queue = this.queue;
    while (!!queue.length) {
      const { Com, state, cb } = queue.shift();
      Com.nextState = { ...(Com.state || {}), ...state };
      if (typeof cb === 'function') {
        cb();
      }
    }
  }

  enqueue(Com, state, cb) {
    const { root } = Com;
    if (root.isUpdating) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      // 如果是通过下一次事件循环在进行更新和执行cb
      this.queue.push({ Com, state, cb });
      this.timeout = setTimeout(() => {
        this.flushQueue();
        this.updateRoot(root);
      }, 0);
      return;
    }
    Com.state = { ...(Com.state || {}), ...state };
    if (typeof cb === 'function') {
      cb();
    }
    this.updateRoot(root);
  }

  updateRoot(node) {
    rerender(node);
  }
}

const updater = new Updater();
export default updater;
