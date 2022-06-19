import React from "react";
import { Mutuals } from "./mutuals";
import { TwitterWebsiteWarning } from "./components/twitter-website-warning";

const App = () => {
  return (
    <div className="p-6">
      <TwitterWebsiteWarning />
      <Mutuals />
    </div>
  );
};

export default App;
