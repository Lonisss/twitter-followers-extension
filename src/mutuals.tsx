import React, { useEffect, useState } from "react";
import { Mutual } from "./components/mutual";
import { getUsernameFromUrl } from "./utils";
import { IMutual, MutualResponse } from "./types";
import { useLocation } from "./hooks/use-location";
import { Button, Container, Image, Pagination, TextInput } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import * as amplitude from "@amplitude/analytics-browser";
import { AtSymbolIcon } from "@heroicons/react/outline";

function Mutuals() {
  const url = useLocation();

  const [mutuals, setMutuals] = useState<IMutual[] | []>([]);
  const [common, setCommon] = useState(0);
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [originUserText, setOriginUserText] = useState("");
  const [originUser, setOriginUser] = useState(
    localStorage.getItem(process.env.ORIGIN_USER_KEY || "")
  );

  async function fetchMutuals(
    targetUsername: string,
    pageNumber = 1
  ): Promise<MutualResponse | null> {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/mutual/?target_username=${targetUsername}&page=${pageNumber}&origin_username=${originUser}`
    );
    if (!res.ok) {
      setStatus(`rejected`);
      return null;
    }
    const textResponse = await res.text();
    if (!textResponse) {
      setMessage("empty response: there is no common users with this account");
      return null;
    }
    return await JSON.parse(textResponse);
  }

  const registerNewUser = async (username: string) => {
    await localStorage.setItem(process.env.ORIGIN_USER_KEY || "", username);
    setOriginUser(username);
    if (username) {
      amplitude.track("origin_user_set", {
        username: username ?? "",
      });
    }
  };

  const removeOriginUser = async () => {
    await localStorage.removeItem(process.env.ORIGIN_USER_KEY || "");
    setOriginUser("");
    setOriginUserText("");
  };

  useEffect(() => {
    const twitterUsername = getUsernameFromUrl(url ?? "");
    if (twitterUsername) {
      setUsername(twitterUsername);
      amplitude.track("twitter_username_set", {
        username: twitterUsername,
      });
    }
  }, [url]);

  useEffect(() => {
    if (username && originUser) {
      setStatus("loading");
      setMessage("");
      fetchMutuals(username, page)
        .then((resData) => {
          setMutuals(resData?.mutuals ?? []);
          setCommon(resData?.common ?? 0);
          setStatus(`idle`);
          amplitude.track("mutuals_fetched", {
            response: resData?.mutuals ?? [],
          });
        })
        .catch((err) => {
          setStatus(`error: ${err}`);
        });
    }
  }, [username, page, originUser]);

  useEffect(() => {
    if (status === "loading") {
      setMutuals([]);
    }
  }, [status]);

  return !originUser ? (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        value={originUserText}
        onChange={(e) => setOriginUserText(e.target.value)}
        placeholder="Your twitter username"
        icon={<AtSymbolIcon className="w-4" />}
      />
      <Button
        onClick={() => registerNewUser(originUserText)}
        color="gray"
        className="mt-2"
      >
        Submit
      </Button>
    </div>
  ) : (
    <div>
      {status === "loading" && (
        <LoadingOverlay
          visible={status === "loading"}
          loaderProps={{ size: "xl", color: "#fff", height: "100%" }}
          overlayOpacity={0.3}
        />
      )}

      <Container
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        {message && (
          <p className="text-lg mb-2">
            <strong>info:</strong> {message}
          </p>
        )}

        {common !== 0 && (
          <p className="text-lg mb-2">
            <strong>Golden Bridges:</strong>{" "}
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

        {status !== "loading" && common !== 0 && (
          <Button onClick={removeOriginUser} color="gray">
            <Image
              src={require("./assets/edit-icon.png")}
              width={"30px"}
              height={"30px"}
            />
          </Button>
        )}
      </Container>

      {mutuals?.length > 0 && (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-3">
            {mutuals.map((mutual) => {
              console.log(mutual);
              return <Mutual key={mutual.link} {...mutual} />;
            })}
          </div>
          {mutuals.length && common > 10 && (
            <Pagination
              total={~~(common / 10) + 1}
              page={page}
              onChange={setPage}
              position="center"
              noWrap
              classNames={{
                item: "text-white",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export { Mutuals };
