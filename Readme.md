# Flipkart Grid 4.0 Open Source Security

![pasted image 0](https://user-images.githubusercontent.com/56640339/182051514-eef0ae1c-20c6-4466-90a2-204bd2af162b.png)

video link - [click here](https://drive.google.com/file/d/1hK9ppqBzortRUGLTpNxSL5D_4NW7rJ0I/view?usp=sharing)
presentation link - [click here](https://docs.google.com/presentation/d/1Agk5Osnayi1qIRwgaqlGB1YZ_CbZtczc/edit?usp=sharing&ouid=118130964582240716932&rtpof=true&sd=true)

## Installation Guide

### Backend
Backend requires 3 environment variables- <br>
- MONGODB_URL <br>
- GITHUB ACCESS TOKEN <br>
- PORT <br>

These variables have to be put in a .env file in the root of the folder
after that run -

```
npm install
npm run start
```

### Frontend

```
cd frontend
npm install
npm run start
```
## Project Description -

The Project uses codeQL a security analytics engine which convert the code to a database and can run various queries over it to detect vulnerablities. the code is forked wusing a script to another users repositories list and a workflow file is created.
this workflow file contains a curated list of codeQL queires to detect code vulnerablities and data theft issues.
This list is being constantly updated by github's security engineers and we won't require any manual efforts to keep up to date with latest code vulnerablities.

Novelty of our project - 

- Use of codeQL a security analysis engine.
- Use of github actions and automated CI/CD pipeline with queries that are curated by github's security engineers which keep on updating time to time.
- We can add other workflows in future to add various other script to detect other vulnerablities.
