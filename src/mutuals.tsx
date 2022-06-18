import React, {useEffect, useState} from "react"
import {Mutual} from "./mutual";
import {getUsernameFromUrl} from "./utils";
import {IMutual} from "./types";

function Mutuals() {
  const [data, setData] = useState<IMutual[] | []>([])
  const [url, setUrl] = useState("")
  const [username, setUsername] = useState("")
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("loading")

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
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/mutual/?target_username=${targetUsername}&page=${pageNumber}`)
      if (!res.ok) {
        setStatus(`error ${res.status}`)
        return []
      }
      return await res.json()
    }

    if (username) {
      setStatus("loading")
      fetchMutuals(username, page).then(resData => {
        setData(resData)
        setStatus("idle")
      }).catch(err => {
        setStatus(`error: ${err}`)
      })
    }
  }, [username, page])
  return (
    <div>
      <p className="text-lg mb-2">
        Current URL: {url}
      </p>
      <p className="text-lg mb-2">
        Current status: {status}
      </p>
      {data && (
        <div className="grid grid-cols-1 gap-4 mb-3">
          {data.map(mutual => {
            return (
              <Mutual key={mutual.link} {...mutual} />
            )
          })}
        </div>
      )}
      <div className="flex justify-between items-center">
        <button
          className="bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-600"
          onClick={() => setPage(page + 1)}
        >
          Increment page
        </button>
        <button
          className="bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-600"
          onClick={() => setPage(page - 1)}
        >
          Decrement page
        </button>
      </div>
    </div>
  )
}

export {Mutuals}