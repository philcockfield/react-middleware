import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

if (typeof window !== 'undefined') {
  console.log('Home/entry.js');
  ReactDOM.render(
    React.createElement(Home, { title: 'Client' }),
    document.getElementById('root')
  );
}
