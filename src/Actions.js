import {fromJS} from "immutable"
import * as api from "./mockAPI";


/**
 * Fetch restaurant listings from the API and pass them to cache
 *
 * @param {String[]} ingredients
 * @param {Number} offset
 * @param {Number} limit
 * @param {Function} dispatch
 * @returns {Promise<any>}
 */
export const fetchRestaurantListings = ({ingredients, offset, limit}, dispatch) => {
    return new Promise((resolve, reject) => {
        api.queryRestaurantsRequest({ingredients, offset, limit})
            .then((response) => {
                dispatch({
                    type: "CACHE_RESTAURANTS",
                    restaurants: fromJS(response.data)
                });

                resolve(response.data)
            })
    })

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
                    type: "CACHE_RESTAURANTS",
                    restaurants: fromJS([response.data])
                });

                resolve(response.data)
            })
    })
};
