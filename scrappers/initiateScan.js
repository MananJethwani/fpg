const getBaseData = require('./getBaseData');
const { Octokit } = require("octokit");
const nodeBase64 = require('nodejs-base64-converter');
const codeQLFileGenerator = require('../utils/codeQLFileGenerator');
const PhishingGenerator = require('../utils/PhishingYmlGenerator');
const codeQLJobChecker = require('./codeQLJobChecker');
const { Package } = require('../models/package');
const { Owner } = require('../models/owner');
var sodium = require('tweetsodium');
const Octokat  = require("octokat");
const fs = require("fs");
const {
    resolve
  } = require('path')
  

const scan = async (owner, repo, type) => {
    const octokit = new Octokit({
        auth: process.env.TOKEN
    })
    const github = new Octokat({
        'token': process.env.TOKEN
    })

    let package = owner + '/' + repo;
    // base data contains default branch, repo stars, contributors list and latest workflow status
    const baseData = await getBaseData(owner, repo, octokit);

    let mongoPackage = new Package({
        package,
        owner,
        stars: baseData.stars
    });

    await mongoPackage.save();

    let ownerData = await Owner.find({owner});
    if (!ownerData.length) {
        ownerData = new Owner({
            owner,
            flagged: false,
        });
        await ownerData.save();
    }

    await octokit.request(`POST /repos/${owner}/${repo}/forks`).then(() => {
        console.log("fork created");
    });

    let public_key;
    let key_id;
    await octokit.request(`GET /repos/mananjethwani/${repo}/actions/secrets/public-key`).then(({data}) => {
        console.log(data);
        public_key = data.key;
        key_id = data.key_id;
    })

    console.log(public_key);

    const messageBytes = Buffer.from(process.env.API_KEY);
    const keyBytes = Buffer.from(public_key, 'base64');

    const encryptedBytes = sodium.seal(messageBytes, keyBytes);

    const encrypted = Buffer.from(encryptedBytes).toString('base64');

    await octokit.request(`PUT /repos/mananjethwani/${repo}/actions/secrets/API_KEY`, {
        owner: 'mananjethwani',
        repo: repo,
        secret_name: 'API_KEY',
        encrypted_value: encrypted,
        key_id: key_id
    })

    // 1 CJS file
    // 2 workflow for phishing
    // 3 workflow for codeQL
    // 4 .github/codeql/codeql-config.yml
    // 5 .github/codeql-queries/test-code-scanning.qls
    // 6 .github/codeql-queries/test-js-queries/outbound-request.ql
    // 7 .github/codeql-queries/test-js-queries/qlpack.yml

    // adding workflow file
    try {
        let rep = await github.repos('mananjethwani', repo).fetch();
        let main = await rep.git.refs(`heads/${baseData.default_branch}`).fetch();
        let treeItems = [];
        let data = fs.readFileSync(resolve("./PhishingScan.cjs")).toString();
        let file1 = await rep.git.blobs.create({content: Buffer.from(data).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: 'PhishingScan.cjs',
            sha: file1.sha,
            mode: "100644",
            type: "blob"
        });

        let file2 = await rep.git.blobs.create({content: Buffer.from(PhishingGenerator(baseData.default_branch)).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/workflows/FPG-Phishing-workflow.yml',
            sha: file2.sha,
            mode: "100644",
            type: "blob"
        });

        let file3 = await rep.git.blobs.create({content: Buffer.from(codeQLFileGenerator(baseData.default_branch, type === 'NPM' ? "javascript" : "python")).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/workflows/FPG-codeQL-workflow.yml',
            sha: file3.sha,
            mode: "100644",
            type: "blob"
        });

        data = fs.readFileSync("./codeql-config.yml").toString();
        let file4 = await rep.git.blobs.create({content: Buffer.from(data).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/codeql/codeql-config.yml',
            sha: file4.sha,
            mode: "100644",
            type: "blob"
        });

        data = fs.readFileSync("./test-code-scanning.qls").toString();
        let file5 = await rep.git.blobs.create({content: Buffer.from(data).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/codeql-queries/test-code-scanning.qls',
            sha: file5.sha,
            mode: "100644",
            type: "blob"
        });

        data = fs.readFileSync("./outbound-request.ql").toString();
        let file6 = await rep.git.blobs.create({content: Buffer.from(data).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/codeql-queries/test-js-queries/outbound-request.ql',
            sha: file6.sha,
            mode: "100644",
            type: "blob"
        });

        data = fs.readFileSync("./qlpack.yml").toString();
        let file7 = await rep.git.blobs.create({content: Buffer.from(data).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/codeql-queries/test-js-queries/qlpack.yml',
            sha: file7.sha,
            mode: "100644",
            type: "blob"
        });

        let tree = await rep.git.trees.create({
            tree: treeItems,
            base_tree: main.object.sha
        });

        let commit = await rep.git.commits.create({
            message: `added phishing`,
            tree: tree.sha,
            parents: [main.object.sha]
        });

        main.update({sha: commit.sha});
    } catch (err) {
        console.log(err);
    }

    // calling job to check if scan is completed
    setTimeout(() => {codeQLJobChecker(repo, octokit, package, baseData.default_branch, owner)}, 5000);
}

module.exports = scan;