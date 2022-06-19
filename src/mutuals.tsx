import React, { useEffect, useState } from "react";
import { Mutual } from "./components/mutual";
import { getUsernameFromUrl } from "./utils";
import { IMutual, MutualResponse } from "./types";
import { useLocation } from "./hooks/use-location";
import { Pagination } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";

function Mutuals() {
  const url = useLocation();

  const [mutuals, setMutuals] = useState<IMutual[] | []>([]);
  const [common, setCommon] = useState(0);
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function fetchMutuals(
    targetUsername: string,
    pageNumber = 1
  ): Promise<MutualResponse | null> {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/mutual/?target_username=${targetUsername}&page=${pageNumber}`
    );
    if (!res.ok) {
      setStatus(`rejected`);
      return null;
    }
    const textResponse = await res.text();
    if (!textResponse) {
      setMessage(
        "empty response: either the account is not supported or the accounts don't have any mutual followers"
      );
      return null;
    }
    return await JSON.parse(textResponse);
  }

  useEffect(() => {
    console.log(process.env.REACT_APP_BASE_URL);
    const twitterUsername = getUsernameFromUrl(url ?? "");
    if (twitterUsername) {
      setUsername(twitterUsername);
    }
  }, [url]);

  useEffect(() => {
    if (username) {
      setStatus("loading");
      setMessage("");
      fetchMutuals(username, page)
        .then((resData) => {
          setMutuals(resData?.mutuals ?? []);
          setCommon(resData?.common ?? 0);
          setStatus(`idle`);
        })
        .catch((err) => {
          setStatus(`error: ${err}`);
        });
    }
  }, [username, page]);

  useEffect(() => {
    if (status === "loading") {
      setMutuals([]);
    }
  }, [status]);

  return (
    <div>
      {status === "loading" && (
        <LoadingOverlay
          visible={status === "loading"}
          loaderProps={{ size: "xl", color: "#fff", height: "100%" }}
          overlayOpacity={0.3}
        />
      )}

      {message && (
        <p className="text-lg mb-2">
          <strong>info:</strong> {message}
        </p>
      )}
      {common !== 0 && (
        <p className="text-lg mb-2">
          <strong>common:</strong>{" "}
          {common <= 10 || page * 10 > common ? (
            <>
              {common}/{common}
            </>
          ) : (
            <>
              {page * 10}/{common}
            </>
          )}
        </p>
      )}

      {mutuals?.length > 0 && (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-3">
            {mutuals.map((mutual) => {
              return <Mutual key={mutual.link} {...mutual} />;
            })}
          </div>
          {mutuals.length && (
            <div className="flex justify-center">
              <Pagination
                total={~~(common / 10) + 1}
                page={page}
                onChange={setPage}
                classNames={{
                  item: "text-white",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Mutuals };
