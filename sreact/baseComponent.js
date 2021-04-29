import updater from './updater';

export class Component {
  constructor(props, context) {
    this.props = props;
    this.context = context;
  }
  setState(state, cb) {
    updater.enqueue(this, state, cb);
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return null;
  }
}
