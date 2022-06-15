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
    <div className="App">
      <header className="App-header">
        <p>URL:</p>
        <p>{url}</p>
      </header>
    </div>
  );
};

export default App;
