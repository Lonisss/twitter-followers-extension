import React from "react"
import {IMutual} from "../types";
import {ExternalLinkIcon} from "@heroicons/react/outline";

function Mutual({username, name, link}: IMutual) {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="flex w-full border border-gray-500 p-2 hover:bg-gray-700 rounded-md transition-colors justify-between">
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