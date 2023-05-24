import fs from 'fs';
import prom from 'prom-client';
const register = new prom.Registry();

const cooldown = 1000;
const Path: string = './src/PromClient/Proms';

const GetPerformance = async (): Promise<void> => {
	function CPU() {
		const cpuUsage = process.cpuUsage();
		const uptime = process.uptime() * 1000;
		const cpuPercent = ((cpuUsage.user + cpuUsage.system) / uptime) * 100;

		// Round the CPU usage percentage to two decimal places
		return parseFloat(cpuPercent.toFixed(2));
	}

	function MEM() {
		const used = process.memoryUsage().heapUsed;
		const total = Math.max(process.memoryUsage().heapTotal, used);
		return (used / total) * 100;
	}

	const cpu = CPU();
	const mem = MEM();

	const cpuGauge = register.getSingleMetric('current_cpu_usage') as prom.Gauge<string>;
	const memGauge = register.getSingleMetric('current_memory_usage') as prom.Gauge<string>;
	if (cpuGauge && memGauge) {
		cpuGauge.set(cpu);
		memGauge.set(mem);
	} else {
		console.log(`Gauge cpu_usage or memory_usage not found!`);
	}
};

const RobloxMetrics = async (): Promise<void> => {
	const GroupsInfo = [
		{ name: 'playcrate_group_count', id: '13004189' },
		{ name: 'minecart_group_count', id: '5799338' },
		{ name: 'breaded_group_count', id: '3409253' },
		{ name: 'stormy_group_count', id: '5998745' },
	];

	const universeID = [
		{
			name: 'bubble',
			id: '4158951932',
		},
		{
			name: 'eating',
			id: '701618141',
		},
		{
			name: 'island',
			id: '1730143810',
		},
		{
			name: 'rotopia',
			id: '3478025530',
		},
	];

	try {
		let groups = [];
		for (const x of GroupsInfo) {
			groups.push(fetch(`https://groups.roblox.com/v1/groups/${x.id}`).then((x) => x.json()));
			await Bot.Utils.Sleep(cooldown);
		}

		let games = [];
		for (let i = 0; i < universeID.length; i++) {
			const x = universeID[i].id;

			const gameResponse = fetch(`https://games.roblox.com/v1/games?universeIds=${x}`);
			const voteResponse = fetch(`https://games.roblox.com/v1/games/votes?universeIds=${x}`);

			const [gameData, voteData] = await Promise.all([gameResponse, voteResponse]).then((responses) =>
				Promise.all(responses.map((response) => response.json())),
			);

			const combinedData = {
				...gameData.data[0],
				...voteData.data[0],
			};

			games.push(combinedData);

			if ((i + 1) % 2 === 0) {
				await Bot.Utils.Sleep(cooldown); // Example cooldown time in milliseconds
			}
		}

		const res = {
			groups: await Promise.all(groups),
			games: (await Promise.all(games)).map((x) => {
				const ratings = x.upVotes + x.downVotes === 0 ? 0 : (x.upVotes / (x.upVotes + x.downVotes)) * 100;
				const findGame = universeID.find((k) => k.id === String(x.id));

				return {
					game: findGame ? findGame.name : null,
					universeId: x.id,
					games_current_rating: Number(ratings.toFixed(2)),
					games_current_favorites: x.favoritedCount,
					games_current_visits: x.visits,
					games_current_users: x.playing,
				};
			}),
		};

		// GROUPS
		for (const { memberCount, id } of res.groups) {
			if (!memberCount || !id) {
				Bot.Logger.Error(new Error('Member count or ID is undefined! Possible rate limited.'));
				continue;
			}

			const group = GroupsInfo.find((x) => x.id === String(id));
			if (group) {
				if (group.name === 'playcrate_group_count') {
					await Bot.Redis.set('play_crate_group_count', memberCount);
				}

				const gauge = register.getSingleMetric(group.name) as prom.Gauge<string>;
				if (gauge) {
					gauge.set(memberCount);
				} else {
					console.log(`Gauge ${group.name} not found!`);
				}
			}
		}

		// GAMES
		for (const x of res.games) {
			const gamePrefix = x.game === 'island' ? '' : `${x.game}_`;

			for (let i = 2; i < 6; i++) {
				const key = Object.keys(x)[i] as keyof typeof x;
				const gauge = register.getSingleMetric(`${gamePrefix}${key}`) as prom.Gauge<string>;

				if (gamePrefix === 'bubble_') {
					await Bot.Redis.set(`play_crate_${key}`, x[key]);
				}

				if (gauge) {
					gauge.set(x[key]);
				} else {
					console.log(`Gauge ${gamePrefix}${key} not found!`);
				}
			}
		}
	} catch (err: Error | any) {
		throw new Error(err);
	}
};

const RobloxRevenue = async (): Promise<void> => {
	const query = `
    SELECT
        CAST(SUM(CASE WHEN purchase_type = 'gamepass' THEN robux_spent ELSE 0 END) AS INTEGER) AS total_robux_gamepass,
        CAST(SUM(CASE WHEN purchase_type = 'product' THEN robux_spent ELSE 0 END) AS INTEGER) AS total_robux_product
    FROM
        robux;

`;

	const { rows } = await Bot.SQL.Query(query);
	const { total_robux_gamepass, total_robux_product } = rows[0];

	const robux_gamepass = register.getSingleMetric('bubble_gamepass_robux') as prom.Gauge<string>;
	const robux_product = register.getSingleMetric('bubble_product_robux') as prom.Gauge<string>;

	if (robux_gamepass && robux_product) {
		robux_gamepass.set(total_robux_gamepass);
		robux_product.set(total_robux_product);
	}
};

(async () => {
	for (const x of fs.readdirSync(Path)) {
		const subFile = await import('./Proms/' + x.replace('.ts', '.js'));
		for (const y of Object.keys(subFile)) {
			register.registerMetric(subFile[y]);
		}
	}
	register.setDefaultLabels({
		app: 'roblox',
	});

	await RobloxRevenue();
	await GetPerformance();
	await RobloxMetrics();

	Bot.Logger.Log('Prometheus metrics loaded!');

	Bot.Cronjob.Schedule('* * * * *', async () => {
		await GetPerformance();
		await RobloxRevenue();
	});

	Bot.Cronjob.Schedule('*/10 * * * *', async () => {
		await RobloxMetrics();
	});
})();

export default register;
