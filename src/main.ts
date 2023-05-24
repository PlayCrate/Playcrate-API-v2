import fs from 'fs';

import { Logger } from './Classes/Logger.js';
import { RedisClient } from './Classes/RedisClient.js';
import { Postgres } from './Classes/Postgres.js';
import { Cronjob } from './Classes/Cronjob.js';
import { Utils } from './Classes/Utils.js';

// @ts-ignore
global.Bot = {};
Bot.Logger = Logger.New();
Bot.Cronjob = Cronjob.New();
Bot.Utils = Utils.New();
Bot.Config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
Bot.Redis = RedisClient.New();
Bot.SQL = Postgres.New();

(async () => {
	await Bot.SQL.CreateTables();
	await import('./API/index.js');
	await import('./PromClient/index.js');
})();
