import React from "react";
import {Map, merge} from "immutable"

export const Store = React.createContext("");

const initialState = {
    // Local store of restaurants, indexed by the restaurant's ID
    restaurantsCache: Map({})
};

function reducer(state, action) {
    switch (action.type) {
        case "CACHE_RESTAURANTS":

            // Match the shape of the restaurants cache
            // (i.e. restaurants indexed by id)
            const restaurantsToMerge = action.restaurants
                .groupBy(r => r.get('id'))
                .mapEntries(([k, v]) => ([k, v.first()]))

            // Shallow merge the updated restaurants
            return {...state, restaurantsCache: merge(state.restaurantsCache, restaurantsToMerge)}

        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
