import Express from 'express';
const Router = Express.Router();

Router.get("/rtc", async(req, res) => {
    const Playing = await Bot.Redis.get("play_crate_playing");
    const Visits = await Bot.Redis.get("play_crate_visits");
    const Fans = await Bot.Redis.get("play_crate_group_count");

    return res.json([Playing, Visits, Fans])
})

export default Router;