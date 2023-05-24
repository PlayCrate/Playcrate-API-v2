import { Config } from './types';

declare global {
	var Bot: {
		Config: Config;
		SQL: import('../Classes/Postgres').Postgres;
		Redis: import("../Classes/Redis").RedisClient;
		Logger: import('../Classes/Logger').Logger;
		Cronjob: import('../Classes/Cronjob').Cronjob;
	};
}

export {};