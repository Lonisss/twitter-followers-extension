import React, { useEffect, useMemo, useRef, useState } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { IMutual } from "../types";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { openInNewTab } from "../utils";

function Mutual({ username, name, link, profilePicture }: IMutual) {
  const imageRef: any = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleClick = () => {
    if (link) {
      void openInNewTab(link);
      amplitude.track("mutual_click", {
        username: username ?? "",
        name: name ?? "",
        link: link ?? "",
      });
    }
  };

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
