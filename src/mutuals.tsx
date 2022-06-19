import React, {useEffect, useState} from "react"
import {Mutual} from "./components/mutual";
import {getUsernameFromUrl} from "./utils";
import {IMutual} from "./types";
import {useLocation} from "./hooks/use-location";
import {Pagination} from "@mantine/core";

function Mutuals() {
  const url = useLocation()

  const [data, setData] = useState<IMutual[] | []>([])
  const [username, setUsername] = useState("")
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")

  async function fetchMutuals(targetUsername: string, pageNumber = 1): Promise<IMutual[]> {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/mutual/?target_username=${targetUsername}&page=${pageNumber}`)
    if (!res.ok) {
      setStatus(`rejected`)
      return []
    }
    const textResponse = await res.text()
    if (!textResponse) {
      setMessage("empty response: either the account is not supported or the accounts don't have any mutual followers")
      return []
    }
    return await JSON.parse(textResponse)
  }

  useEffect(() => {
    const twitterUsername = getUsernameFromUrl(url ?? "")
    console.log(url)
    if (twitterUsername) {
      setUsername(twitterUsername)
    }
  }, [url])

  useEffect(() => {
    if (username) {
      setStatus("loading")
      setMessage("")
      fetchMutuals(username, page).then(resData => {
        setData(resData)
        setStatus(`idle`)
      }).catch(err => {
        setStatus(`error: ${err}`)
      })
    }
  }, [username, page])
  return (
    <div>
      <p className="text-lg mb-2">
        <strong>status:</strong> {status}
      </p>
      {message && (
        <p className="text-lg mb-2">
          <strong>info:</strong> {message}
        </p>
      )}
      {data?.length > 0 && (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-3">
            {data.map(mutual => {
              return (
                <Mutual key={mutual.link} {...mutual} />
              )
            })}
          </div>
          {data.length === 10 && (
            <div className="flex justify-center">
              <Pagination total={3} page={page} onChange={setPage} className="text-xl" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export {Mutuals}