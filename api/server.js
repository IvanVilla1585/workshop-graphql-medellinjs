'use strict'

const express = require('express');
const bodyParse = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParse.json());

app.listen(port, () => console.log(`server running in the port ${port}`));