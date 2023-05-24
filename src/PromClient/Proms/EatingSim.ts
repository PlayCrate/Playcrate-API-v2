import prom from 'prom-client';

const gamesCurrentUser = new prom.Gauge({
    name: 'eating_games_current_users',
    help: 'Current Games Users',
});

const gamesCurrentVisits = new prom.Gauge({
    name: 'eating_games_current_visits',
    help: 'Current Games Visits',
});

const gamesCurrentFavorites = new prom.Gauge({
    name: 'eating_games_current_favorites',
    help: 'Current Games Favorites',
});

const gameRating = new prom.Gauge({
    name: 'eating_games_current_rating',
    help: 'Current Games Rating',
});


export { gamesCurrentUser, gamesCurrentVisits, gamesCurrentFavorites, gameRating };