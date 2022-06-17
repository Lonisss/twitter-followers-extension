import React from "react";
import {Mutuals} from "./mutuals";
import {ExclamationCircleIcon} from "@heroicons/react/outline";

const App = () => {
  return (
    <div className="p-6">
      <div className="flex justify-center space-x-0.5">
        <ExclamationCircleIcon className="w-4" strokeWidth={1.5} />
        <p>
          Make sure you are on <strong>https://twitter.com/</strong>
        </p>
      </div>
      <div>
        <h1 className="text-5xl mb-3">Twitter Mutuals</h1>
        <Mutuals />
      </div>
    </div>
  );
};

export default App;
