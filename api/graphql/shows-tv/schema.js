'use strict'

const schema = [`
  
  # show data
  type Show {
    id: Int,
    name: String,
    type: String,
    language: String
    genres: [String],
    status: String,
    runtime: Int,
    premiered: String,
    akas: [Aka]
  }
  
  type Aka {
    name: String,
    country: Country
  }
  
  type Country {
    name: String,
    code: String,
    timezone: String
  }
  
  type Query {
    shows: [Show]
    showById(id: ID!): Show
  }
`];

module.exports = schema;