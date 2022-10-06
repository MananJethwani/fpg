const getBaseData = async (owner, repo, octokit) => {
    let base = {};
    try {
        // star count and default branch
        await octokit.request(`GET /repos/${owner}/${repo}`).then(({data}) => {
            base.default_branch = data.default_branch,
            base.stars = data.stargazers_count
        });
        // contributor list
        await octokit.request(`GET /repos/${owner}/${repo}/contributors`).then(({data}) => {
            // filter out bots
            data = data.filter((dt) => {
                return !dt.login.endsWith('[bot]');
            }).map((dt) => {
                return {
                    userId: dt.login,
                    contribution: dt.contributions
                }
            }) 
            // slice top 10 contributors
            if (data.length > 10) data = data.slice(0, 10)
            base.contributors = data;
        });

        await octokit.request(`GET /repos/${owner}/${repo}/actions/runs?branch=${base.default_branch}`).then(({data}) => {
            if (data.workflow_runs.length > 0) {
                base.latest_workflow_run_status = data.workflow_runs[0].conclusion === 'success' ? true : false;
            }
        });
        return base;
    } catch(err) {
    console.log(err);
    return base;
    }
};

module.exports = getBaseData;