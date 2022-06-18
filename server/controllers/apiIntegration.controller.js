require("dotenv").config();
const axios = require("axios")
const cheerio = require("cheerio")

function getTweepdiffUrl(username, page = 1) {
  return `https://tweepdiff.com/_Lonis_.followers/${username}?p=${page}`
}

function objectifyPerson(text) {
  text = text.replace(/(\r\n|\n|\r)/gm, "")  // remove new line
  const parts = text.split(" ")
  const username = parts.pop().slice(1, -1)
  const name = parts.join(" ")
  const link = `https://twitter.com/${username}`
  return {
    username,
    name,
    link,
  }
}

function statusResponse(msg) {
  return {
    message: msg
  }
}

async function getMutual(req, res) {
  const username = req?.query?.target_username
  const page = req?.query?.page || 1
  if (!username) {
    res.status(400, statusResponse("Required query parameter `target_username` does not exist")).end()
    return
  }

  const url = getTweepdiffUrl(username, page)
  let data;
  try {
    const response = await axios(url)
    data = response.data
  } catch (e) {
    res.status(500, statusResponse("Unable to do comparison")).end()
    return
  }

  const $ = cheerio.load(data)

  const results = $(".person_link")
  if (results.length === 0) {
    res.status(204, statusResponse("No mutual followers")).end()
    return
  }

  const response = []
  results.each((i, person) => {
    const personText = $(person).text()
    response.push(objectifyPerson(personText))
  })

  res.json(response).end()
}

module.exports = {getMutual}