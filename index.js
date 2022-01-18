const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./schemas/index.js');
const isAuth = require('./middleware/auth');

const app = express();
// const root = { hello: () => 'Hello world!' };
var root = {
  req: function (args, request) {
    return request;
  }
};

app.use(cors());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', (req, res, next) => {
  res.send('Hey There !');
});

console.log('process.env.MONGO_USER', process.env.MONGO_USER, process.env.MONGO_PASS);


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8erqx.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`
).then(
  app.listen(80, () => console.log('Active on: localhost:80/graphql'))
).catch(err => {
  console.log("Error", err)
});