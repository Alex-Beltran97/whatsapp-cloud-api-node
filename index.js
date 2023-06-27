const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 8080;

const token = process.env.TOKEN;
const myToken = process.env.MYTOKEN;

app.listen( PORT , ()=>{
  console.log(`Listening in PORT http://localhost:${ PORT }`);
});

app.get('/webhook', (req, res)=>{
  let mode = req.query['hub.mode'];
  let challenge = req.query['hub.challenge'];
  let token = req.query['hub.verify_token'];

  if(mode && token) {
  
    if(mode === 'suscribe' && token === '') {

      res.status(200).send(challenge);
      
    } else {
      
      res.status(403);

    };
    
  };

});

const instance = axios.create({
  baseURL: 'https://graph.facebook.com/v17.0',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ token }`
  }
});

app.post("/webhook", (req, res)=>{

  let body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if(body.object) {

    if(
      body.entry && 
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {

      const phone_num_id = body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = body.entry[0].changes[0].value.messages[0].from;
      const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

      const data = { 
        "messaging_product": "whatsapp",
        "to": from,
        "text": { "body": "Ola Ke Ase?"}
      };

      instance.post(`/${ phone_num_id }/messages`, JSON.stringify(data));

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    };

  };

});

app.get('/',(req,res)=>{
  res.status(200).send('Hello');
});