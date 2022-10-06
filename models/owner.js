const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
    owner: {
        type: "string",
        required: true,
    },
    stars: {
        type: "number"
    },
    links: {
        type: ["string"]
    },
    flagged: {
        type: "boolean"
    }
    // codeQLData: {
    //     type: ""
    // }
});

const Owner = new mongoose.model("owner", OwnerSchema);

exports.Owner = Owner;