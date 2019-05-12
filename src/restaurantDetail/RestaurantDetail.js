import React, { useEffect } from 'react';

import {
  withStyles,
  Grid,
  Typography,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';

import { Store } from '../Store';
import * as actions from '../Actions';

const styles = (theme) => ({
  restaurantDescription: {
    marginBottom: theme.spacing.unit * 2,
  },

  searchedMenuItem: {
    position: 'relative',
    top: '3px',
    marginRight: theme.spacing.unit / 2,
    fontSize: '20px',
  },

  menuItemName: {
    fontWeight: 600,
  },
});

function RestaurantDetail({ classes, restaurantId }) {
  const { state, dispatch } = React.useContext(Store);
  const {
    restaurantsCache,
    selectedRestaurantId,
    menuWithIngredients,
  } = state;

  useEffect(() => {
    if (restaurantId === selectedRestaurantId) {
      const currentRestaurant = restaurantsCache.get(restaurantId);

      if (!currentRestaurant || !currentRestaurant.get('desc') || !currentRestaurant.get('menu')) {
        actions.fetchRestaurant(restaurantId, dispatch);
      }
    }
  }, [restaurantsCache, restaurantId, selectedRestaurantId, dispatch]);

  const selectedRestaurant = restaurantsCache.get(restaurantId);
  const restaurantMenu = menuWithIngredients.get(restaurantId) || new Map();

  return selectedRestaurant ? (
    <div>
      <Typography variant="h6"
                  className={classes.restaurantDescription}>
        {selectedRestaurant.get('desc')}
      </Typography>

      <Grid container
            spacing={8}>
        {(selectedRestaurant.get('menu') || []).map((menu) => {
          const menuId = menu.get('id');
          const searchedItem = restaurantMenu.get(menuId)
            ? (<StarIcon color="error"
                        className={classes.searchedMenuItem} />)
            : <div></div>;

          return (
            <Grid item xs={6}
                  key={menuId}>
              <div>
                <Typography variant="subheading"
                            className={classes.menuItemName}>
                  <span>
                    {searchedItem}
                    {menu.get('name')}
                  </span>
                </Typography>
              </div>

              {/* TODO: some menu description has HTML in them. Sanitize HTML */}
              <Typography variant="body2">
                {menu.get('desc')}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </div>
  ) : (
    <div>
      Menu Detail Not Available
    </div>
  );
}

export default withStyles(styles)(RestaurantDetail);
