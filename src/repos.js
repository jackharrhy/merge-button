'use strict';

const {outputJson} = require('fs-extra');
const {get} = require('lodash');
const fetch = require('node-fetch');
const path = require('path');

const cacheDirectory = path.resolve(__dirname, 'cache');

const {
  bitbucketUsername,
  bitbucketAppPassword,
  bitbucketOrg,
} = require('./config');

let headers = {
  authorization: `Basic ${Buffer.from(`${bitbucketUsername}:${bitbucketAppPassword}`).toString('base64')}`
};

async function main() {
  try {
    console.log('Fetching a list of repositories from BitBucket');

    let repositoriesUrl = `https://api.bitbucket.org/2.0/repositories/${bitbucketOrg}?pagelen=100`;

    let projects = {};
    let page = 1;

    do {
      console.log(`Loading page ${page++}`);
      const response = await fetch(repositoriesUrl, {headers})
      const repositories = await response.json();

      for (let repository of repositories.values) {
        let name = repository.full_name;
        let description = repository.description;
        let mainBranch = get(repository, 'mainbranch.name', 'master');
        let isPrivate = repository.is_private;
        let cloneUrl = repository.links.clone.find((cloneUrl) => cloneUrl.name === 'ssh').href;
        projects[name] = {
          name: name.replace(`${bitbucketOrg}/`, ''), description, mainBranch, cloneUrl, isPrivate
        }
      }

      repositoriesUrl = repositories.next;
    } while(repositoriesUrl !== undefined);

    await outputJson(path.resolve(cacheDirectory, 'projects.json'), projects, {spaces: '\t'});
  }
  catch (err) {
    console.error(err);
  }
}

main();

