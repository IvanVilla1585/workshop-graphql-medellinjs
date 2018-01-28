'use strict'

const express = require('express');
const bodyParse = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const schema = require('./graphql/schema');
const config = require('./config');
const ShowConnector = require('./graphql/shows-tv/connector');

const app = express();
const port = 3000;

app.use(bodyParse.json());

app.use('/graphql', graphqlExpress(req => {
  return {
    schema,
    context: {
      showConnector: new ShowConnector(config.tvMazeUrl)
    }
  }
}));

app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.listen(port, () => console.log(`server running in the port ${port}`));