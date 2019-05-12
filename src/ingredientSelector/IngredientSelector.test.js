import React from 'react';
import ReactDOM from 'react-dom';
import IngredientSelector from './IngredientSelector';

describe('IngredientSelector', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IngredientSelector/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
