
function getUsernameFromUrl(url: string) {
  const twitter = "https://twitter.com/"
  if (!url.startsWith(twitter)) return
  return url.split(twitter).pop()
}

export {
  getUsernameFromUrl,
}