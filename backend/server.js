const express = require('express')
require('./models');
var cors = require('cors');
const axios = require('axios');
const https = require("https");
const HDRouter = require('./routes/route');

const app = express()
const port = process.env.PORT

app.use(express.json());//middleware for using req.body

app.use(cors({
  origin: ['http://localhost:3000','https://helpdesk.sanimabank.com'],
  methods: ['GET', 'PUT', 'POST', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'Auth-Token', 'Content-Length', 'X-Requested-With', 'Auth', 'X-TFA']
}));

axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

app.use('/api',HDRouter);

app.use("/Files", express.static("./Files"));
app.use("/TicketImages", express.static("./TicketImages"));
app.use("/ManualFiles", express.static("./ManualFiles"));

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.use('*', (req, res) => {
  res.status(404).send({message:'Page 404 Not Found'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})