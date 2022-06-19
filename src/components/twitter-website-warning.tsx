import React from "react"
import {ExclamationCircleIcon} from "@heroicons/react/outline";
import {TwitterURL} from "../constants";
import {useLocation} from "../hooks/use-location";

function TwitterWebsiteWarning() {
  const url = useLocation()
  if (url === TwitterURL) {
    return null
  }

  return (
    <div className="flex justify-center space-x-0.5 mb-3">
      <ExclamationCircleIcon className="w-4" strokeWidth={1.5} />
      <p>
        Make sure you are on <strong>https://twitter.com/</strong>
      </p>
    </div>
  )
}

export {TwitterWebsiteWarning}