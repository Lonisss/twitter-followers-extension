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

const getProfilePictures = async (username, originUser, page, res) => {
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

  return $(".person").map((i, el) => {
    return $(el).children("img").attr("src") ?? emptyProfilePicture;
  });
};

function objectifyPerson(text, profilePicture) {
  text = text.replace(/(\r\n|\n|\r)/gm, ""); // remove new line, aka "\n"
  const parts = text.split(" ");
  const username = parts.pop().slice(1, -1);
  const name = parts.join(" ");
  const link = `https://twitter.com/${username}`;
  return {
    username,
    name,
    link,
    profilePicture,
  };
}

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

  const profilePictures = await getProfilePictures(
    username,
    originUser,
    page,
    res
  );

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

  const common = $("td[valign=top] .current").text().replace(/\D/g, "");
  if (!common) {
    res.status(204, statusResponse("No mutual followers")).end();
    return;
  }

  const results = $(".person_link");

  if (results.length === 0) {
    res.status(204, statusResponse("No mutual followers")).end();
    return;
  }

  const mutuals = [];
  results.each((i, person) => {
    const personText = $(person).text();
    mutuals.push(objectifyPerson(personText, profilePictures[i]));
  });

  res
    .json({
      mutuals,
      common,
    })
    .end();
}

module.exports = { getMutual };
