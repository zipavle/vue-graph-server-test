const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const graphQlSchema = require('./graphql');

const PORT = 4000;

const app = express();
app.options('*', cors());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use((req, res, next) => {
   // check if cookie exists
   console.log(req.headers);
   next();
});

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: graphQlSchema }));
app.use('/playground', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT, () => console.log("server started on port " + PORT));