const { User, Thought } = require('../models');

const resolvers = {
	Query: {
    // return all thoughts or thoughts for a single user
		thoughts: async (parent, { username }) => {
			const params = username ? { username } : {};
			return Thought.find(params).sort({ createdAt: -1 });
		},
    // return a single thought
		thought: async (parent, { _id }) => {
			return Thought.findOne({ _id });
		},
    // return all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts')
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts')
    }
	},
};

module.exports = resolvers;
