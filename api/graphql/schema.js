'use strict'

const merge = require('lodash.merge');
const {makeExecutableSchema} = require('graphql-tools');

const showSchema = require('./shows-tv/schema');
const showResolrver = require('./shows-tv/resolver');
const postSchema = require('./posts/schema');
const postResolrver = require('./posts/resolver');


const typeDefs = [
  ...showSchema,
  ...postSchema
];


const resolvers = merge(
  showResolrver,
  postResolrver
);


const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = executableSchema;
