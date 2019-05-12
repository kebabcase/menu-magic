import React from 'react';
import ReactDOM from 'react-dom';
import RestaurantDetail from './RestaurantDetail';
import { StoreProvider } from '../Store';

describe('RestaurantDetail', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<StoreProvider><RestaurantDetail/></StoreProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  describe('when selected restaurant id changes', () => {
    it('should fetch restaurant details if restaurant and selected ids match', () => {
      //
    });

    it('should not fetch restaurant details if ids do not match', () => {
      //
    });
  });
});
