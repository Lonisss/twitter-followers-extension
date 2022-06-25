
function getUsernameFromUrl(url: string) {
  const twitter = "https://twitter.com/"
  if (!url.startsWith(twitter)) return
  return url.split(twitter).pop()
}

// function to get current active tab index
async function getCurrentTabIndex(): Promise<number | undefined> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      resolve(tabs[0].index);
    });
  });
}

// function to open new link in chrome extension
async function openInNewTab(url: string) {
  // const currentTab = await getCurrentTabIndex();
  await chrome.tabs.create({
    url: url,
    active: false,
    // index: currentTab ? currentTab + 1 : -1,
  });
}

export {
  getUsernameFromUrl,
  openInNewTab,
}