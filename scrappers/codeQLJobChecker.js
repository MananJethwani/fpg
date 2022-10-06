const e = require("express");
const { Owner } = require("../models/owner");
const { Package } = require("../models/package");

const codeQLJobChecker = async (repo, octokit, package, default_branch, owner) => {
    console.log(owner);
    let {result, phishing_check, codeql_check} = await octokit.request(`GET /repos/mananjethwani/${repo}/actions/runs?branch=${default_branch}`).then(({data}) => {
        if (data.workflow_runs.length > 0) {
            let phishing_check = data.workflow_runs.filter((workflow) => {
                return (workflow.name == "Phishing Check");
            })[0];
            let codeql_check = data.workflow_runs.filter((workflow) => {
                return workflow.name == "CodeQL Check"
            })[0];
            console.log(phishing_check.status)
            console.log(codeql_check.status)
            let result = (phishing_check.status === 'completed') && (codeql_check.status === 'completed');
            return {result, phishing_check, codeql_check}
        } else {
            return {result: false, phishing_check: undefined, codeql_check: undefined};
        }
    }).catch(err => {return {result: false, phishing_check: undefined, codeql_check: undefined}});

    if (!result) {
        setTimeout(() => {codeQLJobChecker(repo, octokit, package, default_branch, owner)}, 5000);
    } else {
        console.log(codeql_check);
        console.log(phishing_check);
        let result = false;
        if (codeql_check.status) {
            result = await octokit.request(`GET /repos/mananjethwani/${repo}/code-scanning/alerts`).then(async ({data}) => {
                if (data.length !== 0) {
                    console.log(data);
                    await Package.findOneAndUpdate({package}, {codeQLResult: true, codeQLData: data, reason: "vulnerablities found in repo"});
                    console.log(owner);
                    await Owner.findOneAndUpdate({owner}, {flagged: true});
                    return true;
                } else {
                    return false;
                }
            }).catch(async (err) => {
                return false;
            })
            console.log(result);
            if (result) 
                return;
        }

        if (phishing_check.conclusion === 'failure') {
            console.log('entered');
            await Package.findOneAndUpdate({package}, {codeQLResult: false, phishingCheck: true, phishingCheckAction: phishing_check.html_url, reason: "Phishing detected in markdown files"});
        } else {
            await Package.findOneAndUpdate({package}, { codeQLResult: false, phishingCheck: false });
        }
    }
}

module.exports = codeQLJobChecker;