import sreact from '../sreact/index';

const Hello = (
  <div>
    <span>hi</span>
    <span style={{ color: 'red' }}>sreact</span>
  </div>
);

const Wrap = (props) => {
  return (
    <section>
      <div>
        {props.children}
      </div>
      hi {props.name}
    </section>
  );
}

const App = (
  <Wrap name="wzffzw">
    {Hello}
  </Wrap>
);

const App2 = (
  <Wrap name="wzffzw" />
)

sreact.render(App, document.getElementById('root'));
