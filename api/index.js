const serverlessExpress = require('@vendia/serverless-express');
const app = require('../backend/app');

module.exports = serverlessExpress({ app });
