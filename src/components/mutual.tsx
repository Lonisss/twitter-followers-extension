import React, { useEffect, useMemo, useRef, useState } from "react";
import * as amplitude from "@amplitude/analytics-browser"
import { IMutual } from "../types";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { openInNewTab } from "../utils";

function Mutual({ username, name, link }: IMutual) {
  const imageRef: any = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    require("../assets/default-picture.jpg")
  );
  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  );

  const fetchProfilePicture = async () => {
    const res = await fetch(`https://unavatar.io/twitter/${username}?json`);
    const textResponse = await res.text();

    return await JSON.parse(textResponse);
  };

  useEffect(() => {
    amplitude.init("919bb5f506d083999fbdaf4f7acb0864")
  }, [])

  useEffect(() => {
    if (isIntersecting) {
      fetchProfilePicture().then((data) => {
        setProfilePicture(data.url);
      });
    }
  }, [isIntersecting]);

  useEffect(() => {
    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [imageRef, observer]);

  const handleClick = () => {
    void openInNewTab(link);

    amplitude.track("mutual_click", {
      username,
      name,
      link,
    });
  }

  return (
    <div
      onClick={handleClick}
      className="flex w-full border border-gray-500 p-2 hover:bg-gray-700 rounded-md transition-colors justify-between cursor-pointer select-none"
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            ref={imageRef}
            src={profilePicture}
            style={{
              borderRadius: "100%",
              margin: 5,
              width: "40px",
              height: "40px",
            }}
            alt=""
          />
          <h3 className="text-xl font-medium">
            {name} ({username})
          </h3>
        </div>
        <p className="text-lg text-gray-200">{link}</p>
      </div>
      <div>
        <ExternalLinkIcon className="w-4 text-gray-50" strokeWidth={1} />
      </div>
    </div>
  );
}

export { Mutual };
