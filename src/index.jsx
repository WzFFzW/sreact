import sreact, { Component } from '../sreact/index';

const Hello = (
  <div>
    <span>hi</span>
    <span style={{ color: 'red' }}>sreact</span>
  </div>
);

const Wrap = (props) => {
  return (
    <section onClick={() => { console.log(11) }}>
      <div>
        {props.children}
      </div>
      hi {props.name}
    </section>
  );
}

class Test extends Component {
  constructor() {
    super();
    this.state = {
      num: 0,
    };
  }

  add = () => {
    const { num } = this.state;
    this.setState({
      num: num + 1,
    }, () => { console.log('加完结果', this.state.num); });
    console.log(this.state.num);
  }

  sub = () => {
    const { num } = this.state;
    this.setState({
      num: num - 1,
    }, () => { console.log('减完结果', this.state.num); });
    console.log(this.state.num);
  }

  componentDidMount() {
    console.log('componentDidMount')
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }
  componentWillMount() {
    console.log('componentWillMount')
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate')
  }
  componentDidUpdate() {
    console.log('componentDidUpdate')
  }
  componentWillUpdate() {
    console.log('componentWillUpdate')
  }
  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
  }

  render() {
    return (
      <div>
        <button onClick={this.add}>加</button>
        <span>{this.state.num}</span>
        <button onClick={this.sub}>减</button>
      </div>
    );
  }
}

const App1 = (
  <Wrap name="wzffzw1">
    {Hello}
  </Wrap>
);

const App2 = (
  <Wrap name="wzffzw123" />
)

sreact.render(App1, document.getElementById('root1'));

sreact.render(App2, document.getElementById('root2'));

sreact.render(<Test />, document.getElementById('root3'));
