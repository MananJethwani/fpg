const codeQLFileGenerator = (default_branch, language) => {
    return `
    name: "CodeQL Check"
    
    on:
      push:
        branches: [ "${default_branch}" ]
      pull_request:
        branches: [ "${default_branch}" ]
    
    jobs:
      analyze:
        name: Analyze
        runs-on: ubuntu-latest
        permissions:
          actions: read
          contents: read
          security-events: write
    
        strategy:
          fail-fast: false
          matrix:
            language: [ '${language}' ]
    
        steps:
        - name: Checkout repository
          uses: actions/checkout@v3
    
        # Initializes the CodeQL tools for scanning.
        - name: Initialize CodeQL
          uses: github/codeql-action/init@v2
          with:
            languages: \${{ matrix.language }}
            ${language === 'javascript' && 'config-file: ./.github/codeql/codeql-config.yml'}

        - name: Autobuild
          uses: github/codeql-action/autobuild@v2
    
        - name: Perform CodeQL Analysis
          uses: github/codeql-action/analyze@v2
    `
}

module.exports = codeQLFileGenerator;