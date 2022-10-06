// import axios from "axios";
import "./App.css";
import UrlComponent from "./components/UrlComponent";
import Scanning from "./components/Scanning";
import Result from "./components/Result";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import home from './pages/home';
import { useState } from "react";

function App() {

  let [status, setStatus] = useState("submit");
  let [url, setUrl] = useState("url");

  return (
    <div className="App">
      {status === "submit" ? (
        <div className="entry-page-dashboard">
          <div className="top-heading">OSS INSPECTOR</div>
          <div className="main-heading">Enter the Repository Link</div>
          <UrlComponent
            setStatus={(stat, url) => {
              setStatus(stat);
              setUrl(url);
            }}
          />
        </div>
      ) : status === "scanning" ? (
        <Scanning
          url={url}
          setStatus={(stat) => {
            setStatus(stat);
          }}
        />
      ) : (
        <Result url={url} />
      )}
    </div>
  );
}

export default App;
