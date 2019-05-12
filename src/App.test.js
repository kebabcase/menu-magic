import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StoreProvider } from './Store';

describe('App', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<StoreProvider><App/></StoreProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
