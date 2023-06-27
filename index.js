const express = require("express");

require('dotenv').config();

const app = express();

const PORT = 3000 || process.env.PORT;

app.listen(PORT, ()=>{
  console.log(`Listening in port http://localhost:${ PORT }`)
});