export class Component {
  constructor(props, context) {
    this.props = props;
    this.context = context;
  }
  setState(state, cb) {
    this.updater.enqueue(this, state, cb);
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillMount() {}
  shouldComponentUpdate(nextProps, nextState) {}
  componentDidUpdate() {}
  componentWillUpdate() {}
  componentWillReceiveProps() {}
  render() {
    return null;
  }
}
