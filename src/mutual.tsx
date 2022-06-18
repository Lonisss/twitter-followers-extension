import React from "react"
import {IMutual} from "./types";
import {ExternalLinkIcon} from "@heroicons/react/outline";

function Mutual({username, name, link}: IMutual) {
  return (
    <a href={link} target="_blank">
      <div className="flex w-full border-2 border-gray-500 p-2 hover:border-gray-200 transition-colors justify-between">
        <div>
          <h3 className="text-xl font-medium">
            {name} ({username})
          </h3>
          <p className="text-lg text-gray-200">
            {link}
          </p>
        </div>
        <div>
          <ExternalLinkIcon className="w-4 text-gray-50" strokeWidth={1} />
        </div>
      </div>
    </a>
  )
}

export {Mutual}