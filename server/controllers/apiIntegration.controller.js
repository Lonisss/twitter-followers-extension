require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

const emptyProfilePicture =
  "https://www.pngkey.com/png/detail/282-2820067_taste-testing-at-baskin-robbins-empty-profile-picture.png";

function getTweepdiffUrl(username, originUser, page = 1) {
  return `https://tweepdiff.com/${originUser}.followers/${username}?p=${page}`;
}

function getProfilePictureUrl(username, originUser, page = 1) {
  return `https://tweepdiff.com/${originUser}.followers/${username}?p=${page}&s=1`;
}

const getMutualsInformation = async (username, originUser, page, res) => {
  let mutuals = [];

  const url = getProfilePictureUrl(username, originUser, page);
  let data;
  try {
    const response = await axios(url);
    data = response.data;
  } catch (e) {
    res.status(500, statusResponse("Unable to do comparison")).end();
    return;
  }
  const $ = cheerio.load(data);

  $(".person").map((i, el) => {
    let name = $(el).children("img").attr("title") || "";
    let mutualUsername = name
      .match(/\((.*?)\)/g)
      .map((b) => b.replace(/\(|(.*?)\)/g, "$1"));

    mutuals.push({
      name: name,
      profilePicture: $(el).children("img").attr("src") || emptyProfilePicture,
      link: `https://twitter.com/${
        mutualUsername[mutualUsername.length > 1 ? 1 : 0]
      }`,
    });
  });

  return mutuals || [];
};

const getCommonsNumber = async (username, originUser, page, res) => {
  const url = getTweepdiffUrl(username, originUser, page);
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

  if (!commonsNumber) {
    res.status(204, statusResponse("No mutual followers")).end();
    return;
  }

  return commonsNumber;
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

  const common = await getCommonsNumber(username, originUser, page, res);
  const mutuals = await getMutualsInformation(username, originUser, page, res);

  console.log(mutuals);

  res
    .json({
      mutuals,
      common,
    })
    .end();
}

module.exports = { getMutual };
