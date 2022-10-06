const { Octokit } = require("octokit");
const Octokat  = require("octokat");
var sodium = require('tweetsodium');
const dotenv= require('dotenv')
const fs = require("fs");
const codeQLFileGenerator = require('./utils/codeQLFileGenerator');
const PhishingGenerator = require('./utils/PhishingYmlGenerator');

dotenv.config()

async function scan () {

    try {

        const octokit = new Octokit({
            auth: process.env.TOKEN
        })
    
        const github = new Octokat({
            'token': process.env.TOKEN
        })
    
        let package = 'mananjethwani' + '/' + 'function-bind';
        let repoName = 'function-bind';
    
        let public_key;
        let key_id;
        await octokit.request(`GET /repos/mananjethwani/${repoName}/actions/secrets/public-key`).then(({data}) => {
            console.log(data);
            public_key = data.key;
            key_id = data.key_id;
        })
    
        console.log(public_key);
    
        const messageBytes = Buffer.from(process.env.API_KEY);
        const keyBytes = Buffer.from(public_key, 'base64');
    
        const encryptedBytes = sodium.seal(messageBytes, keyBytes);
    
        const encrypted = Buffer.from(encryptedBytes).toString('base64');
    
        await octokit.request(`PUT /repos/mananjethwani/${repoName}/actions/secrets/API_KEY`, {
            owner: 'mananjethwani',
            repo: repoName,
            secret_name: 'API_KEY',
            encrypted_value: encrypted,
            key_id: key_id
        })
    
        repo = await github.repos('mananjethwani', repoName).fetch();
        let main = await repo.git.refs('heads/master').fetch();
        let treeItems = [];
        let data = fs.readFileSync("./PhishingScan.cjs").toString();
        let file1 = await repo.git.blobs.create({content: Buffer.from(data).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: 'PhishingScan.cjs',
            sha: file1.sha,
            mode: "100644",
            type: "blob"
        });

        let file2 = await repo.git.blobs.create({content: Buffer.from(PhishingGenerator('master')).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/workflows/FPG-Phishing-workflow.yml',
            sha: file2.sha,
            mode: "100644",
            type: "blob"
        });

        let file3 = await repo.git.blobs.create({content: Buffer.from(codeQLFileGenerator('master', 'javascript')).toString('base64'), encoding: 'base64'});
        treeItems.push({
            path: '.github/workflows/FPG-codeQL-workflow.yml',
            sha: file3.sha,
            mode: "100644",
            type: "blob"
        });
        

        let tree = await repo.git.trees.create({
            tree: treeItems,
            base_tree: main.object.sha
        });
        let commit = await repo.git.commits.create({
            message: `added phishing`,
            tree: tree.sha,
            parents: [main.object.sha]
        });
        main.update({sha: commit.sha});
    } catch (err) {
        console.log(err);
    }
}

scan();