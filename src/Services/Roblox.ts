// export class Roblox {
//     async gameInfoData(gameInfo: object) {
//       const { playing, visits, favoritedCount } = gameInfo.data[0];
//       return { playing, visits, favoritedCount };
//     }
  
//     async gameVotesInfo(gameID: string) {
//       const votesInfo = await this.makeRequest(`https://games.roblox.com/v1/games/votes?universeIds=${gameID}`);
//       const { upVotes, downVotes } = votesInfo.data[0];
//       const ratings = upVotes + downVotes === 0 ? 0 : (upVotes / (upVotes + downVotes)) * 100;
//       const fixedRatings = ratings.toFixed(2);
//       return { upVotes, downVotes, fixedRatings };
//     }
  
//     async groupInfo(groupID: string) {
//       const groupInfo = await this.makeRequest(`https://groups.roblox.com/v1/groups/${groupID}`);
//       return {
//         name: groupInfo.name,
//         memberCount: groupInfo.memberCount,
//       };
//     }
//   }