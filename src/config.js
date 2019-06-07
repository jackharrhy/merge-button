'use strict';

require('dotenv').config();

module.exports = {
  bitbucketUsername = process.env.BITBUCKET_USERNAME,
  bitbucketAppPassword = process.env.BITBUCKET_APP_PASSWORD,
  bitbucketOorg = process.env.BITBUCKET_ORG,
};

