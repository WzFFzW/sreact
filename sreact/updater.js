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
    this.updateRoot(root);
  }

  updateRoot(node) {
    rerender(node);
  }
}

const updater = new Updater();
export default updater;
