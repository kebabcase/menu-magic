import React, { useRef, useState, useEffect } from 'react';

import {
  withStyles,
  AppBar,
  Toolbar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import RestaurantIcon from '@material-ui/icons/Restaurant';

import { Store } from './Store';
import * as actions from './Actions';

import IngredientSelector from './ingredientSelector/IngredientSelector';
import RestaurantDetail from './restaurantDetail/RestaurantDetail';

const styles = (theme) => ({
  root: {
    height: '100%',
  },

  appBar: {
    backgroundColor: '#ffffff',
    marginBottom: theme.spacing.unit * 2,
  },

  appTitle: {
    fontWeight: 600,
  },

  content: {
    padding: theme.spacing.unit * 2,
    maxWidth: 800,
    width: '100%',
    height: 'calc(100% - 72px)',
    boxSizing: 'border-box',
    margin: '0 auto',
  },

  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
    maxWidth: 400,
  },

  filterControls: {
    marginBottom: theme.spacing.unit * 3,
  },

  restaurantList: {
    height: 'calc(100% - 48px)',
    overflowY: 'auto',
  },

  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function App(props) {
  const { classes } = props;
  const { state, dispatch } = React.useContext(Store);
  const {
    restaurantsCache,
    selectedRestaurantId,
    selectedIngredients,
    restaurantsByIngredients,
    menuWithIngredients,
  } = state;

  const DEFAULT_FETCH_CONFIG = { offset: 0, limit: 100 };

  const previousIngredients = useRef('');
  const [loading, setLoading] = useState(true);

  /**
   * Pre-fetch restaurant listings
   * To begin with, just show the first 100 restaurants in the cache
   */
  useEffect(() => {
    if (restaurantsCache.isEmpty()) {
      setLoading(true);

      setTimeout(() => {
        actions.fetchRestaurantListings(DEFAULT_FETCH_CONFIG, dispatch)
          .then(() => {
            setLoading(false);
          });
      }, 150);
    }
  }, [restaurantsCache, dispatch, DEFAULT_FETCH_CONFIG]);

  /**
   * Fetch restaurants and menus by user selected ingredients
   */
  useEffect(() => {
    const currentIngredients = selectedIngredients.join('');
    if (previousIngredients.current !== currentIngredients) {
      previousIngredients.current = currentIngredients;

      setLoading(true);

      setTimeout(() => {
        actions.filterRestaurantByIngredients({
          ...DEFAULT_FETCH_CONFIG,
          ingredients: selectedIngredients,
        }, dispatch)
          .then(() => {
            setLoading(false);
          });
      }, 150);
    }
  }, [selectedIngredients, dispatch, DEFAULT_FETCH_CONFIG]);

  function onShowDetail(selectedRestId) {
    return (event, expanded) => {
      actions.setSelectedRestaurantId(selectedRestaurantId === selectedRestId ? '' : selectedRestId, dispatch);
    };
  }

  const ingredientsSelected = !!selectedIngredients.length;
  const restaurantsToShow = (ingredientsSelected ? restaurantsByIngredients : restaurantsCache)
    .valueSeq()
    .sortBy((rest) => rest.get('name'));

  return (
    <main className={classes.root}>
      <header>
        <AppBar position="static"
                className={classes.appBar}>
          <Toolbar variant="dense">
            <Typography variant="h6"
                        className={classes.appTitle}>
              MenuMagic
            </Typography>
          </Toolbar>
        </AppBar>
      </header>

      <section className={classes.content}>

        {/* Filter Controls*/}
        <div id="filter-controls"
             className={classes.filterControls}>
          <IngredientSelector />
        </div>

        {/* Restaurant List*/}
        <div id="restaurant-list"
             className={classes.restaurantList}>
          {(loading ? [] : restaurantsToShow).map((curRestaurant) => {
            const restaurantId = curRestaurant.get('id')

            const matchedMenus = menuWithIngredients.get(restaurantId);
            const matchingMenusLength = matchedMenus
              ? (<Typography variant="subtitle2">
                  {matchedMenus.count()} matching dishes
                </Typography>)
              : <div></div>;

            const restaurantName = (<div>
              <Typography variant="h5">
                {curRestaurant.get('name')}
              </Typography>
              {matchingMenusLength}
            </div>);

            const expanded = selectedRestaurantId === restaurantId;
            const expansionDetails = expanded
              ? <RestaurantDetail restaurantId={restaurantId}></RestaurantDetail>
              : <div></div>;

            return (
              <ExpansionPanel key={restaurantId}
                              expanded={expanded}
                              onChange={onShowDetail(restaurantId)}>
                <ExpansionPanelSummary>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <RestaurantIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={restaurantName} />
                  </ListItem>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {expansionDetails}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </div>

        <div id="loading-restaurants">
          {loading ? <CircularProgress className={classes.progress} /> : <div></div>}
        </div>

        <div id="no-results">
          {(!loading && !restaurantsToShow.count()) ? <Typography variant="h6">No Results</Typography> : <div></div>}
        </div>
      </section>
    </main>
  );
}

export default withStyles(styles)(App);
