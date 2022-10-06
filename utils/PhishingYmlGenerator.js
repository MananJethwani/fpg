const PhishingGenerator = (default_branch) => {
    return `
name: "Phishing Check"

on:
    push:
        branches: [ "${default_branch}" ]
    pull_request:
        branches: [ "${default_branch}" ]
    
env:
    API_KEY: \${{ secrets.API_KEY }}

jobs:
    build:

        runs-on: ubuntu-latest
        
        steps:
        - uses: actions/checkout@v3
        - run: sudo apt-get update
        - run: sudo apt install nodejs npm
        - run: npm init -y
        - run: npm install axios
        - run: node PhishingScan.cjs
    `
}

module.exports = PhishingGenerator;