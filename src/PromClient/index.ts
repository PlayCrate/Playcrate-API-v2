import fs from 'fs';
import prom from 'prom-client';
const register = new prom.Registry();

const Path: string = './src/PromClient/Proms';
(async() => {
    for (const x of fs.readdirSync(Path)) {
        const subFile = await import('./Proms/' + x.replace('.ts', '.js'));
        for (const y of Object.keys(subFile)) {
            register.registerMetric(subFile[y]);
        }
    }

    Bot.Logger.Log('Prometheus metrics loaded!');

    register.setDefaultLabels({
        app: 'roblox'
    })

    const GroupsInfo = [
        { name: "playcrate_group_count", id: "13004189" },
        { name: "minecart_group_count", id: "5799338" },
        { name: "breaded_group_count", id: "3409253" },
        { name: "stormy_group_count", id: "5998745" }
    ]
    // const UniverseInfo = [
    //     {
            
    //     }
    // ]
    const universeID = ['4158951932', '701618141', '1730143810', '3478025530'];

    const groups = GroupsInfo.map((x) => fetch(`https://groups.roblox.com/v1/groups/${x.id}`).then((x) => x.json()));
    const games = universeID.map(async (x) => {
        const Info = universeID.map((x) => fetch(`https://games.roblox.com/v1/games?universeIds=${x}`).then((x) => x.json()));
        const Votes = universeID.map((x) => fetch(`https://games.roblox.com/v1/games/votes?universeIds=${x}`).then((x) => x.json()));

        return {
            info: await Promise.all(Info),
            votes: await Promise.all(Votes),
            id: x
        }
    })

    
    const res = {
        groups: await Promise.all(groups),
        games: await Promise.all(games)
    }

    // GROUPS
    for (const { memberCount, id } of res.groups) {
        const group = GroupsInfo.find((x) => x.id === String(id));
        if (group) {
            const gauge = register.getSingleMetric(group.name);
            if (gauge) {
                // @ts-ignore
                gauge.set(memberCount);
            } else {
                console.log(`Gauge ${group.name} not found!`);
            }
        }
    }

    for (const a of res.games) {
        for (const x of a.votes) {
            console.log(x)
        }
    }
})()

export default register;

