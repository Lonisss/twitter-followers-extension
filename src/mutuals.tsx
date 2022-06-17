import React, {useEffect, useState} from "react"
import {IMutual} from "./types";
import {Mutual} from "./mutual";

function Mutuals() {
  const data: IMutual[] = [
    {
      username: "Alexander_",
      link: "https://twitter.com/disclosetv",
    },
    {
      username: "Lonis_",
      link: "https://twitter.com/testing123",
    },
    {
      username: "Hakim77",
      link: "https://twitter.com/hakim77",
    },
  ]

  const [url, setUrl] = useState<any>("")

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };
    const chromeUrl = chrome.tabs && chrome.tabs.query(queryInfo, (tabs) => {
      return tabs[0].url
    })
    setUrl(chromeUrl)
  }, [])
  return (
    <div>
      {data && (
        <div className="grid grid-cols-1 gap-4">
          {data.map(mutual => {
            return (
              <Mutual key={mutual.link} {...mutual} />
            )
          })}
        </div>
      )}
      {JSON.stringify(url)}
    </div>
  )
}

export {Mutuals}