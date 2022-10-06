let axios = require("axios");
let FS = require("fs");
let Path = require("path");
let Files = [];

function ThroughDirectory(Directory) {
    FS.readdirSync(Directory).forEach(File => {
        const Absolute = Path.join(Directory, File);
        if (FS.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return Files.push(Absolute);
    });
}

function extractLinksFromFiles(Files) {
    let links = [];
    Files.forEach((file) => {
        const str = FS.readFileSync(file).toString();
        links.push(...(str.match(/(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g) || []))
    });
    return links;
}

const result = async (link) => {
    let data2
    try {
        const {data} = await axios({
            method: "post",
            url: "https://developers.checkphish.ai/api/neo/scan",
            headers: {
            "Content-Type": "application/json",
            },
            data: {
            apiKey:
                process.env.API_KEY,
            urlInfo: { url: link },
            },
        });
    
        const id = data.jobID;
    
        data2 = await axios({
        method: "post",
        url: "https://developers.checkphish.ai/api/neo/scan/status",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            apiKey:
            process.env.API_KEY,
            jobID: id,
        },
        });
    
        while(data2.data.status === 'PENDING') {
            data2 = await axios({
                method: "post",
                url: "https://developers.checkphish.ai/api/neo/scan/status",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    apiKey:
                    "qrh04lqekujnl0u864srqkqds9al8e8ez7522ft968qwo6zphqxmqfy8ski15uk0",
                    jobID: id,
                },
                });
        }
    } catch (err) {
        console.log(err);
    }

    if (data2.data && data2.data.disposition != undefined && data2.data.disposition != "clean") {
        throw Error(`Phishing detected for - ${link}`);
    }
};

async function run() {
    ThroughDirectory("./");
    Files = Files.filter((file) => {
        return (file.endsWith(".md") && !file.includes("node_modules"));
    });
    let links = extractLinksFromFiles(Files).map(link => {
        return link.split(')')[0];
    });

    for(let i=0;i<links.length;i++) {
        await result(links[i]);
    }
}
run();
