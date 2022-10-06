const axios=require('axios')

const result = async (link) => {
    const {data} = await axios({
      method: "post",
      url: "https://developers.checkphish.ai/api/neo/scan",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        apiKey:
          "ag8y3egpb0jwf35dfct2xezq1v28flj4ukne2huupp2wzlifsb0orr1ldllq3epg",
        urlInfo: { url: link },
      },
    });

    const id = data.jobID;
    // setTimeout(function() {
    // }, 10000);

    let data2
    data2 = await axios({
    method: "post",
    url: "https://developers.checkphish.ai/api/neo/scan/status",
    headers: {
        "Content-Type": "application/json",
    },
    data: {
        apiKey:
        "ag8y3egpb0jwf35dfct2xezq1v28flj4ukne2huupp2wzlifsb0orr1ldllq3epg",
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
                "ag8y3egpb0jwf35dfct2xezq1v28flj4ukne2huupp2wzlifsb0orr1ldllq3epg",
                jobID: id,
            },
            });
    } 
    
    console.log(data2.data.url)
    console.log(data2.data.disposition);
  };

  module.exports = result