
import express from 'express';
import configViewEngine from './config/viewEngine.js';
import initWebRoutes from './routes/web.js';
import * as dotenv from 'dotenv'; 
import connectDB from './config/connectDB.js';
var cors = require('cors')

import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

app.use(cors({ credentials: true, origin: true }))  





app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// setup view engine
configViewEngine(app);

// init web route
initWebRoutes(app);

connectDB();


app.listen(port, () => {
  console.log(`server listening at port ${port}`)
})