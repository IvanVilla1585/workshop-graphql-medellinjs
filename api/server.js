'use strict'

const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const bodyParse = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const config = require('./config');
const schema = require('./graphql/schema');
const ShowConnector = require('./graphql/shows-tv/connector');
const PostStorage = require('./graphql/posts/storage');
const CommentStorage = require('./graphql/comments/storage');

const app = express();
const port = 3000;

mongoose.Promise = Promise;

const conn = mongoose.createConnection(config.db);

app.use(bodyParse.json());

app.use('/graphql', graphqlExpress(req => {
  return {
    schema,
    context: {
      showConnector: new ShowConnector(config.tvMazeUrl),
      postStorage: new PostStorage(conn),
      commentStorage: new CommentStorage(conn)
    }
  }
}));

app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.listen(port, () => console.log(`server running in the port ${port}`));