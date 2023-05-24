import Express from 'express';
const Router = Express.Router();

Router.get('/rtc', async (req, res) => {
	const Playing = await Bot.Redis.get('play_crate_games_current_users');
	const Visits = await Bot.Redis.get('play_crate_games_current_visits');
	const Fans = await Bot.Redis.get('play_crate_group_count');

	return res.json({
		play_crate_fans: Fans,
		play_crate_playing: Playing,
		play_crate_visits: Visits,
	});
});

export default Router;
