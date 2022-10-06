import React, { useEffect } from "react";
import axios from 'axios';
import "../App.css";

const Scanning = ({setStatus, url}) => {
  let checkStatus = () => {
    console.log(`http://localhost:8080?url=${url}`);
    axios.get(`http://localhost:8080?url=${url}`)
      .then(({ data }) => {
        console.log(data);
        if (data === "scan in progress") {
          setTimeout(checkStatus, 50000);
        } else {
          setStatus("show results");
        }
      })
      .catch((err) => {
        console.log(err);
        checkStatus();
      });
  }
  useEffect(() => {
    setTimeout(checkStatus, 1000);
  },[])
  return (
    <>
      <div className="loader-dashboard">
        <span class="loader"></span>
        <div className="lds-scan">Scanning in progress</div>
      </div>
    </>
  );
}

export default Scanning;