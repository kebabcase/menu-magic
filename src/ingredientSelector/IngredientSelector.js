import React, { useState } from 'react';
import { OrderedSet } from 'immutable';

import {
  withStyles,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from '@material-ui/core';

import { Store } from '../Store';
import * as actions from '../Actions';

import ingredients from '../data/ingredients';

// Use this to populate the ingredient selector component
const ALL_INGREDIENTS = OrderedSet(ingredients.slice(0, 100));

const styles = (theme) => ({
  selectContainer: {
    width: '250px',
  },
  placeholder: {
    color: '#c8c8c8',
  },
});

function IngredientSelector({ classes }) {
  const { dispatch } = React.useContext(Store);

  const [open, setOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  function onIngredientSelect($event) {
    setSelectedIngredients($event.target.value);
  }

  function onIngredientSelectOpen() {
    setOpen(true);
  }

  function onIngredientSelectClose() {
    setOpen(false);

    setTimeout(() => {
      actions.setSelectedIngredients(selectedIngredients, dispatch);
    });
  }

  return (
    <form autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="select-multiple-ingredients">
          Ingredients
        </InputLabel>
        <Select className={classes.selectContainer}
                multiple
                displayEmpty
                open={open}
                value={selectedIngredients}
                onChange={onIngredientSelect}
                onClose={onIngredientSelectClose}
                onOpen={onIngredientSelectOpen}
                input={<Input id="select-multiple-ingredients" />}
                renderValue={(selected) => {
                  if (!selected.length) {
                    return (<div className={classes.placeholder}>
                      Ingredients
                    </div>);
                  }

                  return selected.join(', ');
                }}>
          {ALL_INGREDIENTS.map((INGREDIENT) => (
            <MenuItem key={INGREDIENT}
                      value={INGREDIENT}>
              {INGREDIENT ? INGREDIENT : 'None'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}

export default withStyles(styles)(IngredientSelector);
