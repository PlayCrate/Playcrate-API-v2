import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { join } from 'path';
import fs from 'fs';

const App = express();
const Path: string = './src/API/Routes';

(async () => {
	for (const file of fs.readdirSync(Path)) {
		const subFolder = join(Path, file);
		const subFolderFiles = fs.readdirSync(subFolder);

		for (const subFile of subFolderFiles) {
			if (!subFile.endsWith('.ts')) continue;
			const Route = await import(`./Routes/${file}/${subFile.replace('.ts', '.js')}`);
			App.use(Route.default);

			Bot.Logger.Log(`[${file}] Endpoint ${subFile} is running!`);
		}
	}
})();

App.use(cors(), morgan('dev'), express.json(), express.urlencoded({ extended: true }));
App.listen(Bot.Config.API.port, () => {
	Bot.Logger.Log(`API listening on port ${Bot.Config.API.port}`);
});