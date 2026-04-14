const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// require all the routes here
const authRouter = require('./routes/auth.routes');

// using all the route here
app.use('/api/auth', authRouter);

module.exports = app;
