const { User } = require('../models');

const userController = {
  // GET all users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // GET a single user by its _id and populated thought and friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: 'thoughts',
        select: '-__v -username'
      })
      .populate({
        path: 'friends',
        select: '-__v -thoughts'
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // POST a new user:
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // PUT to update a user by its _id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // DELETE to remove user by its _id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json({ message: 'User and associated thoughts deleted!' });
      })
      .catch(err => res.status(400).json(err));
  },

  // POST to add a new friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: { _id: params.friendId } } },
      { new: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // DELETE to remove a friend from a user's friend list
  removeFriend({ params }, res) {
    console.log(params);
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .populate({
        path: 'friends',
        select: '-__v -thoughts'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },
};

// BONUS: Remove a user's associated thoughts when deleted.

module.exports = userController;