const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express()
const movieRouter = require('./api/routes/movies');
const userRouter = require('./api/routes/user');

dotenv.config();
mongoose.connect(
  'mongodb+srv://t0e:'+process.env.MONGO_ATLAS_PW+'@cluster0-4qgq3.mongodb.net/test?retryWrites=true&w=majority',
  {useNewUrlParser: true}
)
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/movies', movieRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app
