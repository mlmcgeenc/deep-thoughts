const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in schema data
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new insptance of an Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
	await server.start();
	// integrate Apollo server with the Express application as middleware
	server.applyMiddleware({ app });

db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}!`);
		// log where GQL API can be tested
		console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
	});
});
}

// call the async function to start the server
startApolloServer(typeDefs, resolvers);
