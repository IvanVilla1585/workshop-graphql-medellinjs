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
- Create a folder called graphql: ```mkdir graphql```
- Create a folder called shows-tv: ```mkdir graphql/shows-tv```
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
    
    - configure graphql and graphiql: 
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
      
      app.listen(port, () => console.log(`server running in the port ${port}`));
    ```
