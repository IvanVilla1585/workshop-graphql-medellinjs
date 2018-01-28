const schema = [`
  
  # data to create post
  input PostInput {
    author: String!, 
    email: String, 
    title: String!, 
    body: String!
  }
  
  # data to update post
  input PostEditInput {
    author: String, 
    email: String, 
    title: String, 
    body: String
  }
  
  # data post
  type Post {
    id: ID, 
    author: String, 
    title: String, 
    body: String,
    createdAt: String
  }
  
  union SearchResult = Post
  
  extend type Query {
    # find all post
    posts: [Post]
    # find all post and comments
    search(search: String!): [SearchResult]
    # find post by id
    postById(id: ID!): Post
  }
  
  type Mutation {
    # create post
    postAdd(data: PostInput): Post
    # update post
    postEdit(id: ID!, data: PostEditInput): Post
    # delete post
    postDelete(id: ID!): Post
  }
`];

module.exports = schema;