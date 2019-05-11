import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import RestaurantIcon from '@material-ui/icons/Restaurant'
import {Store} from "./Store";
import * as actions from "./Actions";
import {OrderedSet} from 'immutable'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ingredients from './data/ingredients'

// Use this to populate the ingredient selector component
export const ALL_INGREDIENTS = OrderedSet(ingredients.slice(0,100))


const styles = theme => ({
    root: {},

    appBar: {
        backgroundColor: "#ffffff",
        marginBottom: theme.spacing.unit * 2
    },

    content: {
        padding: theme.spacing.unit * 2,
        maxWidth: 800,
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto"
    },

    formControl: {
        margin: theme.spacing.unit,
        minWidth: 200,
        maxWidth: 400,
    },

    filterControls: {
        marginBottom: theme.spacing.unit * 3
    },

    restaurantList: {}

});


function App(props) {
    const {classes} = props
    const { state, dispatch } = React.useContext(Store);
    const {restaurantsCache} = state

    useEffect(() => {
        //pre-fetch restaurant listings
        restaurantsCache.isEmpty() && actions.fetchRestaurantListings({offset: 0, limit: 100}, dispatch)
    });

    // To begin with, just show the first 100 restaurants in the cache
    let restaurantsToShow= restaurantsCache.valueSeq().sortBy(x=>x.get('name'))

    return (
        <main className={classes.root}>
            <header>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar variant='dense'>
                        <Typography variant="h6">
                            MenuMagic
                        </Typography>
                    </Toolbar>
                </AppBar>
            </header>


            <section className={classes.content}>

                {/* Filter Controls*/}
                <div id="filter-controls" className={classes.filterControls}>

                    {/* Filter controls should go here*/}
                </div>

                {/* Restaurant List*/}
                <div id="restaurant-list" className={classes.restaurantList}>

                    {restaurantsToShow.map((curRestaurant) => {
                        const restId = curRestaurant.get('id')
                        const line1Text = <Typography variant="h5">{curRestaurant.get('name')}</Typography>

                        return (
                        <ExpansionPanel key={restId}>
                            <ExpansionPanelSummary>
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                        <Avatar><RestaurantIcon/></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={line1Text}/>
                                </ListItem>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                 Restaurant Details should go here
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                    )})}
                </div>
            </section>
        </main>
);
}


export default withStyles(styles)(App);
