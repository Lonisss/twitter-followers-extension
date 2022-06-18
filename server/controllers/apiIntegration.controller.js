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

async function getMutual(req, res) {
  const username = req.query?.target_username
  const page = req.query?.page || 1
  if (!username) {
    res.statusMessage = "Bad request: `target_username` is missing from query."
    res.status(400).end()
  }

  const url = getTweepdiffUrl(username, page)
  const {data} = await axios(url)

  const $ = cheerio.load(data)

  const results = $(".person_link")
  if (results.length === 0) {
    res.status(204)
    res.json().end()
  }

  const response = []
  results.each((i, person) => {
    const personText = $(person).text()
    response.push(objectifyPerson(personText))
  })

  res.status(200)
  res.json(response).end()
}

module.exports = {getMutual}