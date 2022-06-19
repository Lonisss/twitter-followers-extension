import {useEffect, useState} from "react";
import {TwitterURL} from "../constants";

function useLocation() {
  const [url, setUrl] = useState("")

  useEffect(() => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const chromeUrl = tabs[0].url;
      setUrl(chromeUrl ?? "")
    })
    setUrl(TwitterURL + "citydao")
  }, [])

  return url
}

export {useLocation}