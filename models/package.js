const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    package: {
        type: "string",
        required: true,
    },
    stars: {
        type: "number"
    },
    latest_workflow_run_status: {
        type: "boolean"
    },
    flagged: {
        type: "boolean"
    },
    codeQLResult: {
        type: "boolean"
    },
    owner: {
        type: "string"
    },
    codeQLData: {
        type: "object"
    },
    reason: {
        type: "string"
    },
    phishingCheckAction: {
        type: "string"
    },
    phishingCheck: {
        type: "boolean"
    }
});

const Package = new mongoose.model("package", PackageSchema);

exports.Package = Package;