require("dotenv").config();
const axios = require("axios");
const { TwitterApi } = require("twitter-api-v2");

const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
const roClient = twitterClient.readOnly;

let userNextPage = "";
let targetNextPage = "";
let mutuals = [];

const getMutualFollowingsList = async (req, res) => {
  const user = await roClient.v2.usersByUsernames("GabrielPeterss4");
  const target = await roClient.v2.usersByUsernames("hakim_hamaili");

  const userFollowers = userNextPage
    ? await roClient.v2.followers(user.data[0].id, {
        pagination_token: userNextPage,
      })
    : await roClient.v2.followers(user.data[0].id);

  const targetFollowings = targetNextPage
    ? await roClient.v2.following(target.data[0].id, {
        pagination_token: targetNextPage,
      })
    : await roClient.v2.following(target.data[0].id);

  const filteredList = userFollowers.data.filter((element) =>
    targetFollowings.data.includes(element)
  );

  filteredList.forEach((userElement) => {
    mutuals = [...mutuals, userElement];
  });

  if (userFollowers.meta.next_token || targetFollowings.meta.next_token) {
    console.log("Still searching");
    userNextPage = userFollowers.meta.next_token
      ? userFollowers.meta.next_token
      : "";
    targetNextPage = targetFollowings.meta.next_token
      ? targetFollowings.meta.next_token
      : "";

    getMutualFollowingsList(req, res);
  } else {
    console.log("finished! check results");

    res.json(mutuals);
  }
};

module.exports = { getMutualFollowingsList };
