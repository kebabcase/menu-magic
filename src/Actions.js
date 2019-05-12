import { fromJS } from 'immutable';
import * as api from './mockAPI';

/**
 * Fetch restaurant listings from the API and pass them to cache
 *
 * @param {String[]} ingredients
 * @param {Number} offset
 * @param {Number} limit
 * @param {Function} dispatch
 * @returns {Promise<any>}
 */
export const fetchRestaurantListings = ({ ingredients, offset, limit }, dispatch) => {
  return new Promise((resolve, reject) => {
    api.queryRestaurantsRequest({ ingredients, offset, limit })
      .then((response) => {
        dispatch({
          type: 'CACHE_RESTAURANTS',
          restaurants: fromJS(response.data),
        });

        resolve(response.data);
      });
  });
};

/**
 * Fetch restaurant listings and menu items filtered by ingredients from the API
 *
 * @param {String[]} ingredients
 * @param {Number} offset
 * @param {Number} limit
 * @param {Function} dispatch
 * @returns {Promise<any>}
 */
export const filterRestaurantByIngredients = ({ ingredients, offset, limit }, dispatch) => {
  return new Promise((resolve, reject) => {
    const fetchRestaurantsPromise = api.queryRestaurantsRequest({ ingredients, offset, limit })
      .then((response) => {
        dispatch({
          type: 'SET_RESTAURANTS_BY_INGREDIENTS',
          restaurants: fromJS(response.data),
        });

        return response.data;
      });
    const fetchMenusPromise = fetchMenuByIngredients({ ingredients, offset, limit }, dispatch);

    Promise.all([
      fetchRestaurantsPromise,
      fetchMenusPromise,
    ]).then(resolve);
  });
};

/**
 * Fetch a complete restaurant from the API and pass to cache
 *
 * @param {String} id
 * @param {Function} dispatch
 * @returns {Promise<any>}
 */
export const fetchRestaurant = (id, dispatch) => {
  return new Promise((resolve, reject) => {
    api.getRestaurantRequest(id)
      .then((response) => {
        dispatch({
          type: 'CACHE_RESTAURANTS',
          restaurants: fromJS([response.data]),
        });

        resolve(response.data);
      });
  });
};

/**
 * Fetch menu items filtered by ingredients from the API
 *
 * @param {String[]} ingredients
 * @param {Number} offset
 * @param {Number} limit
 * @param {Function} dispatch
 * @returns {Promise<any>}
 */
export const fetchMenuByIngredients = ({ ingredients, offset, limit }, dispatch) => {
  return new Promise((resolve, reject) => {
    api.queryRecipesRequest({ ingredients, offset, limit })
      .then((response) => {
        dispatch({
          type: 'SET_MENU_WITH_INGREDIENTS',
          menuWithIngredients: response.data,
        });

        resolve(response);
      });
  });
};

/**
 * Set selected restaurant to view its details
 *
 * @param {String} selectedRestaurantId
 * @param {Function} dispatch
 * @returns {void}
 */
export const setSelectedRestaurantId = (selectedRestaurantId, dispatch) => {
  dispatch({
    type: 'SET_SELECTED_RESTAURANT_ID',
    selectedRestaurantId,
  })
};

/**
 * Set selected ingredietns
 *
 * @param {String[]} selectedIngredients
 * @param {Function} dispatch
 * @returns {void}
 */
export const setSelectedIngredients = (selectedIngredients, dispatch) => {
  dispatch({
    type: 'SET_SELECTED_INGREDIENTS',
    selectedIngredients,
  });
};
