require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

const emptyProfilePicture =
  "https://www.pngkey.com/png/detail/282-2820067_taste-testing-at-baskin-robbins-empty-profile-picture.png";

function getMutualsUrl(username, originUser, page = 1) {
  return `https://tweepdiff.com/${originUser}.followers/${username}?p=${page}&s=2`;
}

const getMutualsInformation = async (username, originUser, page, res) => {
  let mutuals = [];

  const url = getMutualsUrl(username, originUser, page);
  let data;
  try {
    const response = await axios(url);
    data = response.data;
  } catch (e) {
    res.status(500, statusResponse("Unable to do comparison")).end();
    return;
  }
  const $ = cheerio.load(data);
  const commonsNumber = $("td[valign=top] .current").text().replace(/\D/g, "");
  $(".person").map((i, el) => {
    let mutualProfilePicture = $(el)
      .children(".details")
      .children("h2")
      .children("a")
      .children("img")
      .attr("src");

    let mutualName =
      $(el)
        .children(".details")
        .children("h2")
        .children("a")
        .children("span")
        .text() || "";
    let mutualFollowersNumber =
      $(el)
        .children(".details")
        .children(".stats")
        .children(".followers")
        .children(".count")
        .text() || 0;

    let mutualUsername = mutualName
      .match(/\((.*?)\)/g)
      .map((b) => b.replace(/\(|(.*?)\)/g, "$1"));

    mutuals.push({
      name: mutualName,
      profilePicture: mutualProfilePicture || emptyProfilePicture,
      link: `https://twitter.com/${
        mutualUsername[mutualUsername.length > 1 ? 1 : 0]
      }`,
      followersNumber: Number(mutualFollowersNumber),
    });
  });

  if (!commonsNumber) {
    res.status(204, statusResponse("No mutual followers")).end();
    return;
  }

  return {
    mutuals:
      mutuals.sort((a, b) => {
        return b.followersNumber - a.followersNumber;
      }) || [],
    common: commonsNumber,
  };
};

function statusResponse(msg) {
  return {
    message: msg,
  };
}

async function getMutual(req, res) {
  const originUser = req.query.origin_username;
  const username = req.query.target_username;
  const page = req.query.page || 1;
  if (!username || !originUser) {
    res
      .status(
        400,
        statusResponse(
          "Required query parameter `target_username` or `origin_username` does not exist"
        )
      )
      .end();
    return;
  }

  await getMutualsInformation(username, originUser, page, res).then(
    (mutuals) => {
      console.log(mutuals);
      res.json(mutuals).end();
    }
  );
}

module.exports = { getMutual };
