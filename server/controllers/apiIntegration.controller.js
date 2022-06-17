require("dotenv").config();
const axios = require("axios");
const { TwitterApi } = require("twitter-api-v2");

const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
const roClient = twitterClient.readOnly;

const getMutualFollowingsList = async (req, res) => {
  const user = await roClient.v2.usersByUsernames("elonmusk");

  const userFollowers = await twitterClient.v2.followers(user.data[0].id);
  res.json(userFollowers);
};

module.exports = { getMutualFollowingsList };
