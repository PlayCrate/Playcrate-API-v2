import Express from 'express';
import register from '../../../PromClient/index.js';
const Router = Express.Router();

Router.get("/metrics", async(req, res) => {
    res.setHeader('Content-Type', register?.contentType);
    return res.end(await register?.metrics());
})

export default Router;