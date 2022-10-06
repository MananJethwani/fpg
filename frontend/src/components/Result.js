import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import cross from "../images/cross.png";
import tick from "../images/tick.png";

const Result = ({ url }) => {
  let [data, setData] = useState(null);
  let [owner, setOwner] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080?url=${url}`)
      .then(({ data: dt }) => {
        console.log(dt);
        setData(dt.data);
        setOwner(dt.owner);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {!data ? (
        <div className="loader-dashboard">
          <span class="loader"></span>
          <div className="lds-scan">Scanning in progress</div>
        </div>
      ) : !data.codeQLResult ? (
        <div className="final-report">
          <div className="result-status">
            <div>
              <span>Scan completed</span>
              {data.phishingCheck ? (<img src={cross} alt="status"></img>) : (<img src={tick} alt="status"></img>)}
            </div>
            <div className="result-table">
              <div>
                <span>Repo: </span>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </div>
              <div>
                <span>Status: </span> {data.phishingCheck ? 'Phishing detected!' : 'This Repo is Safe to use👍'}
              </div>
              <div>
                <span>Package Name: </span>
                {data.package}
              </div>
              <div>
                <span>Repo Stars: </span> {data.stars}
              </div>
              <div>
                {
                    data.phishingCheck ? (
                      <div>
                      <span> for more info on phishing detection: </span>
                        
                      {!data.workflow_run_status && (
                        <>
                          <a
                            href={data.phishingCheckAction}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {" "}
                            click here{" "}
                          </a>
                        </>
                      )}
                    </div>
                    ) : (
                    <div>
                      <span> latest workflow test status: </span>
                        
                      {!data.workflow_run_status && (
                        <>
                          <a
                            href={`https://github.com/MananJethwani/phishing-check/actions`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {" "}
                            click here{" "}
                          </a>
                        </>
                      )}
                    </div>
                    )
                }
              </div>
            </div>
          </div>
          <div>
            {console.log(owner)}
            <div className="author-head">Author</div>
            <div className="author-details">
              <div>
                <img src={owner.avatar_url} alt="owner-avatar" />{" "}
              </div>
              <div>
                <span>Owner: </span>
                {owner.login}
              </div>
              <div>
                <span>Public repo count: </span>
                {owner.public_repos}
              </div>
              <div>
                <span>Followers: </span>
                {owner.followers}
              </div>
              <div>
                <span>Following: </span>
                {owner.following}
              </div>
            </div>
          </div>
        </div>
      ) :  (
        <div className="final-report final-report-2">
          <div className="final-report-scan">
            <div>
              <span>Scan completed</span>
              <img src={cross} alt="status"></img>
            </div>
            <div className="result-status-fail">
              <div>
                <span>Repo: </span>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </div>
              <div>
                <span>Status: </span>Unsafe Package Name - {data.package}{" "}
              </div>
              <div>
                <span>Repo Stars: </span>
                {data.stars}{" "}
              </div>
              <div>
                <span>Latest workflow test status: </span>{" "}
                {data.workflow_run_status ? "true" : "false"}{" "}
              </div>
              {!data.workflow_run_status && (
                <>
                  <a href={`https://github.com/${data.package}/actions`}>
                    click here
                  </a>
                </>
              )}{" "}
              <span>Reason: </span>
              {data.reason}
            </div>
            <div className="total-vul">
              <span>
                total vulnerabilities found - {data.codeQLData.length}
              </span>
              {data.codeQLData && data.codeQLData.length && (
                <>
                  {data.codeQLData.map((dt, idx) => {
                    console.log(dt);
                    return (
                      <div key={idx} className="errors">
                        <div>
                          <span>Description: </span>
                          {dt.rule.description}{" "}
                        </div>
                        <div>
                          <span>Security severity level: </span>{" "}
                          {dt.rule.security_severity_level}
                        </div>
                        {/* <div>
                          <span>Alert message: </span>
                          {dt.most_recent_instance.message.text}{" "}
                        </div> */}
                        <div>
                          <span>Url: </span>
                          <a href={dt.url}>{dt.url}</a>{" "}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <div>
            {console.log(owner)}
            <div className="author-head">Author</div>
            <div className="author-details">
              <div>
                <img src={owner.avatar_url} alt="owner-avatar" />{" "}
              </div>
              <div>
                <span>Owner: </span>
                {owner.login}
              </div>
              <div>
                <span>Public repo count: </span>
                {owner.public_repos}
              </div>
              <div>
                <span>Followers: </span>
                {owner.followers}
              </div>
              <div>
                <span>Following: </span>
                {owner.following}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Result;
