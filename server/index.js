//index.js
import express from 'express';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import cors from 'cors';
import mongoose from 'mongoose';
import graphQLSchema from './graphql/schema';
import graphQLResolvers from './graphql/resolvers';
require('dotenv').config();

const app = express();

app.use(cors(), bodyParser.json());

app.use(
  '/graphql',
  expressGraphQL({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  }),
);

function main() {
  const port = process.env.PORT || 5000;
  const uri = process.env.DB_URL;
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`MongoDB connected on '${uri}'`);
      app.listen(port, () =>
        console.log(`Server is listening on port: ${port}`),
      );
    })
    .catch((err) => {
      console.log('DB connect error:', err);
    });
}
main();
