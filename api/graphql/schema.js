'use strict'

const merge = require('lodash.merge');
const {makeExecutableSchema} = require('graphql-tools');

const showSchema = require('./shows-tv/schema');
const showResolrver = require('./shows-tv/resolver');


const typeDefs = [
  ...showSchema
];


const resolvers = merge(
  showResolrver
);


const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = executableSchema;
