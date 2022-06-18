import React, { useEffect, useState } from "react";
import { Mutual } from "./mutual";
import { getUsernameFromUrl } from "./utils";
import { IMutual } from "./types";
import axios from "axios";

function Mutuals() {
  const [data, setData] = useState<IMutual[] | []>([]);
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const chromeUrl = tabs[0].url;
        setUrl(chromeUrl ?? "");
      });
  }, []);

  useEffect(() => {
    const twitterUsername = getUsernameFromUrl(url);
    if (twitterUsername) {
      setUsername(twitterUsername);
    }
  }, [url]);

  useEffect(() => {
    async function fetchMutuals(
      targetUsername: string,
      pageNumber = 1
    ): Promise<IMutual[]> {
      const res = await axios.get(
        `https://fast-forest-05025.herokuapp.com/mutual?target_username=${targetUsername}&page=${pageNumber}`
      );
      if (res.status !== 200) {
        setStatus(`error: ${res.status}`);
        return [];
      }
      const textResponse = await res.data;
      if (!textResponse) {
        setMessage(
          "empty response: either the account is not supported or the accounts don't have any mutual followers"
        );
        return [];
      }
      return await textResponse;
    }

    if (username) {
      setStatus("loading");
      setMessage("");
      fetchMutuals(username, page)
        .then((resData) => {
          setData(resData);
          setStatus(`idle`);
        })
        .catch((err) => {
          setStatus(`error: ${err}`);
        });
    }
  }, [username, page]);
  return (
    <div>
      <p className="text-lg mb-2">
        <strong>request status:</strong> {status}
      </p>
      {message && (
        <p className="text-lg mb-2">
          <strong>request info:</strong> {message}
        </p>
      )}
      {data?.length > 0 && (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-3">
            {data.map((mutual) => (
              <Mutual key={mutual.link} {...mutual} />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button
              className="bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-600"
              onClick={() => setPage(page - 1)}
            >
              Decrement page
            </button>
            <button
              className="bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-600"
              onClick={() => setPage(page + 1)}
            >
              Increment page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Mutuals };
