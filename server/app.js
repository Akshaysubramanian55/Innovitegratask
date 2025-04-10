const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();


app.use(cors()); 
app.use(express.json())

const connect = require('./db/config');
const userRoutes = require('./routes/userroutes');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(userRoutes);
connect();



app.listen(process.env.PORT, () => {
    console.log(`server listening at http://localhost:${process.env.PORT}`);
  })