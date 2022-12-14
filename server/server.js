const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in schema data
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

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
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);
