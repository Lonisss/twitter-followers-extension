import React, {useEffect} from "react";
import { Mutuals } from "./mutuals";
import { TwitterWebsiteWarning } from "./components/twitter-website-warning";
import * as amplitude from "@amplitude/analytics-browser";

const App = () => {
  useEffect(() => {
    amplitude.init("919bb5f506d083999fbdaf4f7acb0864");
    amplitude.track("page_view");
  }, [])
  return (
    <div className="p-6">
      <TwitterWebsiteWarning />
      <Mutuals />
    </div>
  );
};

export default App;
