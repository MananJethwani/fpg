// const fs=require('fs')
// const result = require('./func')

// const data = fs.readFileSync('./links.txt', 'utf8');
// const links = data.split("\n")

// for(const link of links) {
//     result(link);
// }

const express = require('express')
const axios = require('axios')
const dotenv= require('dotenv')
// const getBaseData = require("./scrappers/getBaseData");
const scan = require('./scrappers/initiateScan');
const { Octokit } = require("octokit");
const mongoose = require("mongoose");
const { Package } = require("./models/package");
const { Owner } = require("./models/owner");

dotenv.config()

const PORT=process.env.PORT || 3000
const app = express()

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
};

app.use(express.json());
app.use(allowCrossDomain);

app.get('/', async (req,res)=> {
  let { url } = req.query;

  const octokit = new Octokit({
    auth: process.env.TOKEN
  });

  let [, owner, repo ] = url.match(/https:\/\/github.com\/(.*)\/(.*)(\/|)/);
  let package = owner + '/' + repo;
  console.log(package);
  const data = await Package.find({package});
  console.log(data);

  if (data.length) {
    console.log(data);
    if (data[0].codeQLResult === undefined) {
        res.status(200).send("scan in progress");
        return;
    }
    const userInfo = (await octokit.request(`GET /users/${owner}`)).data;
    res.status(200).send({data: data[0], owner: userInfo});
    return;
  } else {
    res.status(404).send();
    return;
  }
})

app.post('/scan', async (req, res) => {
    let {url, type} = req.body;
    let [, owner, repo ] = url.match(/https:\/\/github.com\/(.*)\/(.*)(\/|)/);
    let package = owner + "/" + repo;
    const data = await Package.find({package});

    if (data.length) {
        if (data[0].codeQLResult === undefined) {
            res.status(200).send("scanning already in progress");
            return;
        }
        else {
            res.status(200).send({data: data[0]});
            return;
        }
    } else {
        const ownerData = await Owner.find({owner});
        console.log(ownerData);
        if (ownerData.length && ownerData[0].flagged !== undefined && ownerData[0].flagged) {
            const pkg = new Package({
                package,
                owner,
                codeQLResult: true,
                reason: "owner already flagged"
            });
            await pkg.save();
            res.status(200).send("scanning done");
            return;
        }
    }

    scan(owner, repo, type);
    
    res.status(200).send("scanning initialized");
})

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => { 
    console.log("connected to MongoDB");
    app.listen(PORT);
    console.log(`listening at port ${PORT}`);
  })
  .catch((err) => console.error("could not connect to MongoDB...", err));
