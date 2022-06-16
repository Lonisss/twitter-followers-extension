import React, { useEffect, useState } from "react";

const App = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setUrl(url ?? "");
      });
  }, []);

  return (
    <div className="p-6">
      <div>
        <h1 className="text-5xl">URL:</h1>
        <p>{url}</p>
      </div>
    </div>
  );
};

export default App;
