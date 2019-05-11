

## Context

At StreetLinx we’re always looking for exercises that maximize signal on candidates and minimize the time / effort for everyone involved.

“MenuMagic” is a toy frontend for an imaginary service that simulates some analogous problems we’re solving at StreetLinx. StreetLinx helps connect buyers and sellers on the types of securities they care about, MenuMagic helps foodies find restaurants based on the types of food they care about.

To get a glimpse of how you’d solve problems like these in code, we’d like you to make a few changes to MenuMagic and show us your work. Please take a look around the existing code, make the following changes, then send us a PR.



## Getting Started

```
npm install
npm start
```

## Todo

1. When a user clicks a restaurant in the Restaurant List, the card currently expands and shows… nothing. Instead, it should expand to show details about the restaurant (i.e. its description) and the restaurant’s menu. 
    * It should look something like this: [Restaurant List Mockup](https://projects.invisionapp.com/share/SHRX3LH6MBQ#/screens/362268006), [Restaurant Details Mockup](https://projects.invisionapp.com/share/SHRX3LH6MBQ#/screens/362268007).
    * When implementing this, we strongly encourage using built in components from the [Material UI library](https://material-ui.com/). 
2. When a user selects 1 or more ingredients from the ingredient list, filter the restaurant list to only show restaurants that have at least 1 dish that matches all of the selected ingredients. 
    * It should look something like this: [Restaurant List Filtered Mockup 1](https://projects.invisionapp.com/share/SHRX3LH6MBQ#/screens/362268005), [Restaurant List Filtered Mockup 2](https://projects.invisionapp.com/share/SHRX3LH6MBQ#/screens/362268002).
3. When a filter is active, also show an indicator in each Restaurant List item of the number of matching dishes. e.g. if filtering by “bacon”, and the restaurant has 3 dishes made with bacon, show “3 matching dishes.”
    * It should look something like this: [Restaurant List Filtered Mockup 1](https://projects.invisionapp.com/share/SHRX3LH6MBQ#/screens/362268005).
4. When a filter is active and the user is viewing the restaurant’s details, the show a star beside each dish that matches the filter criteria.
    * It should look something like this: [Restaurant Details + Filtering Mockup](https://projects.invisionapp.com/share/SHRX3LH6MBQ#/screens/362268003).