import React from "react";
import {Mutuals} from "./mutuals";
import {ExclamationCircleIcon} from "@heroicons/react/outline";

const App = () => {
  return (
    <div className="p-6">
      <div className="flex justify-center space-x-0.5 mb-3">
        <ExclamationCircleIcon className="w-4" strokeWidth={1.5} />
        <p>
          Make sure you are on <strong>https://twitter.com/</strong>
        </p>
      </div>
      <div>
        <Mutuals />
      </div>
    </div>
  );
};

export default App;
