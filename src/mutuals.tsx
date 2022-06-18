import React, {useEffect, useState} from "react"
import {Mutual} from "./mutual";
import {getUsernameFromUrl} from "./utils";
import {IMutual} from "./types";

const baseUrl = "http://localhost:4000/"


function Mutuals() {
  const [data, setData] = useState<IMutual[] | []>([])
  const [url, setUrl] = useState("")
  const [username, setUsername] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const chromeUrl = tabs[0].url;
      setUrl(chromeUrl ?? "");
    });
    setUrl("https://twitter.com/citydao")
  }, []);

  useEffect(() => {
    const twitterUsername = getUsernameFromUrl(url)
    if (twitterUsername) {
      setUsername(twitterUsername)
    }
  }, [url])

  useEffect(() => {
    async function fetchMutuals(targetUsername: string, pageNumber = 1): Promise<IMutual[]> {
      const res = await fetch(`${baseUrl}?target_username=${targetUsername}&page=${pageNumber}`)
      if (!res.ok) {
        return []
      }
      return await res.json()
    }

    if (username) {
      fetchMutuals(username, page).then((resData) => {
        setData(resData)
      })
    }
  }, [username, page])
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
      <p>
        testing: {url}
      </p>
      <button onClick={() => setPage(page + 1)}>
        Increment page
      </button>
    </div>
  )
}

export {Mutuals}