const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  updateThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/').get(getAllThoughts);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
