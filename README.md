# Workshop graphql with nodejs

## Prerequisites

- [nodejs 8.9.4 LTS](https://nodejs.org/es/download/)  
- [MongoDB](https://docs.mongodb.com/manual/tutorial/)  


## Let's get started

- Open the terminal and create a new folder for the project: mkdir workshop-graphql
- Navigate to the root of the folder: cd workshop-graphql
- Create the package.json file: npm init
- Create a file called server.js: touch server.js


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
 
 app.listen(port, () => console.log(`server running in the port ${port}`));
```