const dotenv= require('dotenv')
const fs = require("fs");
const { Octokit } = require("octokit");
const axios = require("axios");

dotenv.config()

async function run() {
    const octokit = new Octokit({
        auth: process.env.TOKEN
    })

    let {phishing_check, codeql_check} = await octokit.request(`GET /repos/mananjethwani/react-live/actions/runs?branch=master`).then(({data}) => {
        if (data.workflow_runs.length > 0) {
            let phishing_check = data.workflow_runs.filter((workflow) => {
                return (workflow.name == "Phishing Check");
            })[0];
            let codeql_check = data.workflow_runs.filter((workflow) => {
                return workflow.name == "CodeQL Check"
            })[0];
            console.log(phishing_check);
            console.log(codeql_check);
            return {phishing_check: phishing_check.status === 'completed', codeql_check: codeql_check.status === 'completed'}
        } else {
            return false;
        }
    }).catch(err => {return true});
    console.log(phishing_check, codeql_check);
}

run();