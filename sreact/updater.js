import { rerender } from './render';

class Updater {
  queue = [];
  timeout

  enqueue(Com, state, cb) {
    const { root } = Com;
    if (!Com.updaterQueue) {
      Com.updaterQueue = [{ state, cb }];
    } else {
      Com.updaterQueue.push({ state, cb });
    }
    // TODO: 统一在下一个workLoop中更新，后续优化
    setTimeout(() => {
      this.updateRoot(root);
    }, 0);
  }

  updateRoot(node) {
    rerender(node);
  }
}

const updater = new Updater();
export default updater;
