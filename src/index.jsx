import sreact from '../sreact/index';

const Hello = (
  <div>
    <span>hellow</span>
    <span style={{ color: 'red' }}>sreact</span>
  </div>
);

sreact.render(Hello, document.getElementById('root'));
