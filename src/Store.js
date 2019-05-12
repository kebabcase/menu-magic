import React from 'react';
import { Map, merge } from 'immutable';

export const Store = React.createContext('');

const initialState = {
  // Local store of restaurants, indexed by the restaurant's ID
  restaurantsCache: Map({}),

  // Subset of restaurants that has menu items with selected ingredients
  restaurantsByIngredients: Map({}),

  // Keyed by restaurant id: Map<Menu>
  menuWithIngredients: Map({}),

  selectedRestaurantId: '',
  selectedIngredients: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'CACHE_RESTAURANTS': {
      // Match the shape of the restaurants cache
      // (i.e. restaurants indexed by id)
      const restaurantsToMerge = action.restaurants
        .groupBy((restaurant) => restaurant.get('id'))
        .mapEntries(([k, v]) => ([k, v.first()]));

      // Shallow merge the updated restaurants
      return {
        ...state,
        restaurantsCache: merge(state.restaurantsCache, restaurantsToMerge),
      };
    }

    case 'SET_RESTAURANTS_BY_INGREDIENTS': {
      return {
        ...state,
        restaurantsByIngredients: action.restaurants
          .groupBy((restaurant) => restaurant.get('id'))
          .mapEntries(([k, v]) => ([k, v.first()])),
      };
    }

    case 'SET_MENU_WITH_INGREDIENTS': {
      let restaurantToMenu = new Map({});
      action.menuWithIngredients.forEach((menu) => {
        const menuId = menu.id;
        const restaurantId = menu.restaurantId;

        let menus = restaurantToMenu.get(restaurantId);
        if (!menus) {
          menus = new Map({});
        }

        restaurantToMenu = restaurantToMenu.set(restaurantId, menus.set(menuId, menu));
      });

      return {
        ...state,
        menuWithIngredients: restaurantToMenu,
      };
    }

    case 'SET_SELECTED_RESTAURANT_ID': {
      return {
        ...state,
        selectedRestaurantId: action.selectedRestaurantId,
      };
    }

    case 'SET_SELECTED_INGREDIENTS': {
      return {
        ...state,
        selectedRestaurantId: '',
        selectedIngredients: action.selectedIngredients,
      };
    }

    default: {
      return state;
    }
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <Store.Provider value={value}>
      {props.children}
    </Store.Provider>
  );
}
