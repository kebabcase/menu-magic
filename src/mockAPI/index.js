/**
 * Several "API" functions that simulate making an HTTP request against a plausible backend for the service.
 *
 * The responses are promises that vaguely resemble an axios request response.
 * Response data will be actual JSON, not immutable objects.
 *
 * Don't read too much into the implementation, just assume all of this is coming from a black box API.
 *
 */
import { Map, setIn, Set, fromJS } from "immutable"
import recipesById from './recipesById'
import recipeIdsByIng from './recipeIdsByIng'
import restaurantsById from './restaurantsById'

// Pretend backend data
const RECIPES_BY_ID = fromJS(recipesById)
const RECIPES = RECIPES_BY_ID.valueSeq()
const RECIPES_BY_RESTAURANT_ID = RECIPES.groupBy(r => r.get('restaurant-id'))
const RECIPE_IDS = Set(RECIPES_BY_ID.keys())
const RECIPES_BY_INGREDIENT = fromJS(recipeIdsByIng)
const RESTAURANTS_BY_ID = fromJS(restaurantsById)


/**
 * Pretend HTTP request
 * Gets restaurant 'listings' that have dishes matching the filter criteria
 *
 * If there are no criteria, results are returned in alphabetical order
 * If there are criteria, results are returned in descending order of matching dishes, then alphabetical
 *
 * Typical listing looks like:
 * {id: "0RUBsJD7J0nyxJKEOU3Tbw", name: "Aaron's Briny Shack"}
 *
 * @param {String[]} ingredients - set of ingredient tags
 * @param {Number} offset
 * @param {Number} limit
 * @returns {Promise<any>}
 */
export const queryRestaurantsRequest = ({ ingredients, offset, limit }) => {
  ingredients = fromJS(ingredients || [])
  offset = offset || 0
  limit = limit || 100
  return new Promise((resolve, reject) => {

    // Calculate matching recipes by intersecting ID sets
    const matchingRecipes = ingredients
      .map(ing => RECIPES_BY_INGREDIENT.get(ing))
      .reduce((output, curSet) => (output.intersect(curSet)), RECIPE_IDS)
      .map(recId => RECIPES_BY_ID.get(recId));

    // Lookup table for getting matching counts for a restaurant
    const matchingRecipesByRestaurantId = matchingRecipes.groupBy(rec => rec.get('restaurant-id'))

    // Sort by # of matching recipes, then restaurant name
    const sortByMatchCountFn = rest => ([
      (Number.MAX_SAFE_INTEGER - matchingRecipesByRestaurantId.get(rest.get('id')).count()).toString().padStart(10, "0"),
      RESTAURANTS_BY_ID.get(rest.get('id')).get('name')
    ].join("_"))

    // Sort alphabetically by restaurant name
    const sortByNameFn = rest => ([
      RESTAURANTS_BY_ID.get(rest.get('id')).get('name')
    ].join("_"))

    // Choose sort fn based on criteria
    const sortByFn = ((ingredients.isEmpty()) ? sortByNameFn : sortByMatchCountFn)

    // Calculate response data
    const output = matchingRecipes
      // map to restaurants
      .map(rec => RESTAURANTS_BY_ID.get(rec.get('restaurant-id')))
      // only return limited set of attributes for the restaurants
      .map(rest => Map({ id: rest.get('id'), name: rest.get('name') }))
      // apply sort
      .sortBy(sortByFn)
      // cut for the page
      .slice(offset, offset + limit).toJS()

    resolve({ data: output, status: 200 })
  })
};



/**
 * Pretend HTTP request
 * Gets a full restaurant
 *
 * Typical restaurant looks like:
 * {
 *    "desc": "A detailed description of Aaron's Briny Shack.",
 *    "name": "Aaron's Briny Shack",
 *    "id": "0RUBsJD7J0nyxJKEOU3Tbw",
 *    "menu":
 *        [{  "id": "LVtFbS8LNyWiIWFY4jgOsw",
 *            "restaurant-id": "0RUBsJD7J0nyxJKEOU3Tbw",
 *            "ingredient-set": ["peel", "unsalted", "star", "kosher", "sugar", "cream", "flour", "soda"],
 *            "name": "Mini Star-Anise Scones ",
 *            "desc": "Get the freshest ground star anise by making your own. It's as easy as grinding a few star anise pods in a spice mill or a coffee grinder."
 *        },
 *        {   "id": "VLx9ngAbt05irzqqWRkjSQ",
 *            "restaurant-id": "0RUBsJD7J0nyxJKEOU3Tbw",
 *            "ingredient-set": ["asparagus", "shallots", "spears", "peas", "vegetable", "oil"],
 *            "name": "Veal Scaloppine with Spring Pea Coulis and Asparagus ",
 *            "desc": "Open a bottle of fruity Chardonnay to serve with this enlightened take on a classic."
 *        }]
 * }
 *
 * @param {String} id - restaurant ID
 * @returns {Promise<any>}
 */
export const getRestaurantRequest = (id) => {
  return new Promise((resolve, reject) => {

    // Associate the menu data with the rest of the restaurant data
    const output = setIn(RESTAURANTS_BY_ID.get(id), ['menu'], RECIPES_BY_RESTAURANT_ID.get(id)).toJS()
    resolve({ data: output, status: 200 })
  })
};



/**
 * Pretend HTTP request
 * Gets recipe (aka dish, menuitem, etc) 'listings' that match the filter criteria
 *
 * Results are returned in descending order of matching dishes, then alphabetical
 *
 * Typical listing looks like:
 * {id: "r8NJJBhVwiBS6MCVxs8V1A", name: "Some delicious dish", restaurantId: "N7c1EBdQV8Yz6-S-sKNJFw"}
 *
 * @param {String[]} ingredients - set of ingredient tags
 * @param {Number} offset
 * @param {Number} limit
 * @returns {Promise<any>}
 */
export const queryRecipesRequest = ({ ingredients, offset, limit }) => {
  ingredients = ingredients || []
  offset = offset || 0
  limit = limit || 100
  return new Promise((resolve, reject) => {

    // Calculate matching recipes by intersecting ID sets
    const matchingRecipes = ingredients
      .map(ing => RECIPES_BY_INGREDIENT.get(ing))
      .reduce((output, curSet) => (output.intersect(curSet)), RECIPE_IDS)
      .map(recId => RECIPES_BY_ID.get(recId))

    // Lookup table for getting matching counts for a restaurant
    const matchingRecipesByRestaurantId = matchingRecipes.groupBy(rec => rec.get('restaurant-id'))

    // Sort by # of matching recipes, then restaurant name
    const sortByFn = rec => ([
      (Number.MAX_SAFE_INTEGER - matchingRecipesByRestaurantId.get(rec.get('restaurant-id')).count()).toString().padStart(10, "0"),
      RESTAURANTS_BY_ID.get(rec.get('restaurant-id')).get('name')
    ].join("_"))

    // Calculate the response
    const output = matchingRecipes
      // Apply sort
      .sortBy(sortByFn)
      // Cut for page
      .slice(offset, offset + limit)
      // Only return limited set of attributes for the 'listing'
      .map(rec => ({ id: rec.get('id'), name: rec.get('title'), restaurantId: rec.get('restaurant-id') }))
      .toJS()

    resolve({ data: output, status: 200 })
  })
};
