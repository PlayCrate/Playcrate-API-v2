export type Config = {
	Postgres: {
		password: string;
		user: string;
		host: string;
		port: number;
		database: string;
	};
	API: {
		port: number;
		refresh_time: number;
		Authorization: string;
	};
	DEBUG: boolean;
	Twitter: {
		Bearer: string;
	};
};