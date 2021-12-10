const express = require("express")
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())

const authR = require('./routes/authentication')
app.use('/auth',authR)
const loginR = require('./routes/login')
app.use('/login',loginR)
const accountR = require('./routes/account')
app.use('/account',accountR)
const registerR = require('./routes/register')
app.use('/register',registerR)
const profR = require('./routes/prof')
app.use('/prof',profR)
app.listen(3000, ()=> console.log("Backend Started"))