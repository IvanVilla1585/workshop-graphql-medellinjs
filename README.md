# Workshop graphql with nodejs

## Prerequisites

- [nodejs 8.9.4 LTS](https://nodejs.org/es/download/)  
- [MongoDB](https://docs.mongodb.com/manual/tutorial/)  


## Let's get started

- Open the terminal and create a new folder for the project: ```mkdir workshop-graphql```
- Navigate to the root of the folder: ```cd workshop-graphql```
- Create the package.json file: ```npm init```
- Create a folder called api: ```mkdir api```
- Create a file called server.js: ```touch api/server.js```


## Create Server

- Install express ```npm i -S express```
- Install nodemon as dev dependency ```npm i -D nodemon```
- On the package.json we are going to add the following script ```"start": "nodemon server.js"```
- This will be our initial server.js

```js
'use strict'
 
 const express = require('express');

 const app = express();
 
 const port = 3000;
 
 app.listen(port, () => console.log(`Server is now running on http://localhost:${port}`));
```


## Create the Shows Entity


- Install next dependencies ```npm i -S apollo-server-express body-parser graphql graphql-tools lodash.merge node-fetch```
- Create a folder called graphql: ```mkdir api/graphql```
- Create a folder called shows-tv: ```mkdir api/graphql/shows-tv```
- On the folder shows-tv we are going to create the following files:

    - Create a file called schema.js and added the next code
```js
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
```


    - Create a file called resolver.js and added the next code
```js
  'use strict'
  
  const resolver = {
    Query: {
      shows(root, args, {showConnector}) {
        let results = [];
  
        try {
          results = showConnector.getShows();
        } catch (err) {
          throw new Error('Error: find all shows')
        }
  
        return results;
      },
      showById(root, args, {showConnector}) {
        let results = {};
  
        try {
          results = showConnector.getShowById(args.id);
        } catch (err) {
          throw new Error('Error: find show by id')
        }
  
        return results;
      }
    },
    Show: {
      akas({id}, args, {showConnector}) {
        let results = [];
        try {
          results = showConnector.getShowsAkas(id);
        } catch (err) {
          throw new Error('Error: find all akas')
        }
  
        return results;
      }
    }
  };
  
  
  module.exports = resolver;
```

    - Create a file called connector.js and added the next code
```js
  'use strict'
  
  const fetch = require('node-fetch');
  
  
  class ShowConnector {
    constructor(url = '') {
      if (!url) throw new Error()('The url is not provider');
      this.API_ROOT = url;
    }
  
    async fetch(url) {
      const URL = `${this.API_ROOT}${url}`;
      const res = await fetch(URL).then(r => r.json());
  
      if (res.errors) throw Error(res.message);
      return res;
    }
  
    getShows() {
      return this.fetch('/shows?page=1');
    }
  
    getShowById(id) {
      return this.fetch(`/shows/${id}`);
    }
  
    getShowsAkas(id) {
      return this.fetch(`/shows/${id}/akas`);
    }
  }
  
  module.exports = ShowConnector;
```

## Configure the global schema

- On the folder graphql we are going to create a file called schema.js and added next code:
```js
  'use strict'
  
  const merge = require('lodash.merge');
  const {makeExecutableSchema} = require('graphql-tools');
  
  const showSchema = require('./shows-tv/schema');
  const showResolver = require('./shows-tv/resolver');
  
  
  const typeDefs = [
    ...showSchema
  ];
  
  
  const resolvers = merge(
    showResolver
  );
  
  
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  
  module.exports = executableSchema;
```

## Configure the graphql server

- On the folder api we are going to create a file called config.js and added next code:
```js
  'use strict'
  
  module.exports = {
    db: 'mongodb://localhost:27017/workshop-graphql',
    tvMazeUrl: 'http://api.tvmaze.com'
  };
```

- On the file server.js we are going to added next code:

    - import the next files: 
    ```js
      
    const bodyParse = require('body-parser');
    const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
    
    const config = require('./config');
    const schema = require('./graphql/schema');
    const ShowConnector = require('./graphql/shows-tv/connector');
    ```
    
    - Configure graphql and graphiql: 
    ```js
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
    ```
    
    - The server.js file should be seen as follows:
    ```js
      'use strict'
      
      const express = require('express');
      const bodyParse = require('body-parser');
      const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
      
      const config = require('./config');
      const schema = require('./graphql/schema');
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
      
      app.listen(port, () => console.log(`Server is now running on http://localhost:${port}`));
    ```
    
    
## Create the Post Entity

- Create a folder called posts: ```mkdir api/graphql/posts```
- On the folder posts we are going to create the following files:

    - Create a file called schema.js and added the next code
    ```js
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
        
        extend type Query {
          # find all post
          posts: [Post]
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
    ```
    
    - Create a file called resolver.js and added the next code
    ```js
      const resolver = {
        Query: {
          async posts(root, args, {postStorage}) {
            let results = [];
            try {
              results = await postStorage.find();
            } catch (err) {
              throw new Error('Error: find all posts');
            }
            return results;
          },
          async postById(root, args, {postStorage}) {
            let result = {};
            try {
              result = await postStorage.findById(args.id);
            } catch (err) {
              throw new Error('Error: find post by id');
            }
            return result;
          }
        },
        Post: {
          async comments({id}, args, {commentStorage}) {
            let result = [];
            try {
              result = await commentStorage.find({postId: id});
            } catch (err) {
              throw new Error('Error: find comments');
            }
            return result;
          }
        },
        Mutation: {
          postAdd(root, args, {postStorage}) {
            let result = {};
            try {
              result = postStorage.save({...args.data});
            } catch (err) {
              throw new Error('Error: save post');
            }
            return result;
          },
          async postEdit(root, args, {postStorage}) {
            let result = {};
            try {
              result = await postStorage.update(args.id, {...args.data});
            } catch (err) {
              throw new Error('Error: update post');
            }
            return result;
          },
          async postDelete(root, args, {postStorage}) {
            let result = {};
            try {
              result = await postStorage.delete(args.id);
            } catch (err) {
              throw new Error('Error: delete post');
            }
            return result;
          }
        }
      };
      
      module.exports = resolver;
    ```
    
    - Create a file called model.js and added the next code
    ```js
      'use strict'
      
      const mongoose = require('mongoose');
      
      const schema = new mongoose.Schema({
        title: {
          type: String,
          required: 'The title field is required'
        },
        body: {
          type: String,
          required: 'The body field is required'
        },
        author:{
          type: String,
          required: 'The author field is required'
        },
        email:{
          type: String
        }
      }, {timestamps: true});
      
      if (!schema.options.toJSON) schema.options.toJSON = {};
      
      /**
       * Add a tranforma method to change _id by id
       * whent toJSON is used.
       */
      schema.options.toJSON.transform = (doc, ret) => {
        // remove the _id of every document before returning the result
        ret.id = ret._id;
        delete ret._id;
        return ret;
      };
      
      
      module.exports =  mongoose.model('Post', schema);
    ```
    
    - Create a file called storage.js and added the next code
    ```js
      'use strict'
      
      require('./model');
      
      class PostStorage {
        constructor(conn = null) {
          if (!conn) throw new Error('connection not provider');
      
          this.Model = conn.model('Post');
        }
      
        async save(data) {
          let result = {};
          try {
            result = await new this.Model(data).save();
          } catch (err) {
            throw new Error(err.messages);
          }
          return result;
        }
      
        async update(id, data) {
          let result = {};
          try {
            result = await this.Model.findByIdAndUpdate(id, {$set: data}, {new: true});
            if (!result) {
              result = {failed: true, message: 'Post not found'}
            }
          } catch (err) {
            throw new Error(err.messages);
          }
          return result;
        }
      
        async delete(id) {
          let result = {};
          try {
            result = await this.Model.findByIdAndRemove(id);
            if (!result) {
              result = {failed: true, message: 'Post not found'}
            }
          } catch (err) {
            throw new Error(err.messages);
          }
          return result;
        }
      
        async find(query = {}) {
          let results = [];
          try {
            results = await this.Model.find(query);
          } catch (err) {
            throw new Error(err.messages);
          }
          return results;
        }
      
        async findById(id) {
          let result = {};
          try {
            result = await this.Model.findById(id);
            if (!result) {
              result = {failed: true, message: 'Post not found'}
            }
          } catch (err) {
            throw new Error(err.messages);
          }
          return result;
        }
      }
      
      module.exports = PostStorage;
    ```
    
## Configure the global schema

- On the file schema.js we are going to added next code:
```js
  'use strict'
  
  const postSchema = require('./posts/schema');
  const postResolver = require('./posts/resolver');
  
  
  const typeDefs = [
    ...showSchema,
    ...postSchema
  ];
  
  
  const resolvers = merge(
    showResolver,
    postResolver
  );
  
  module.exports = executableSchema;
```