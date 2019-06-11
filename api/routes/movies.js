const express = require('express');
const router = express.Router();
const check_auth = require('../middleware/check_auth');
const moviesController = require('../controllers/movies');

router.get('/', moviesController.get_all_movies);

router.post('/', check_auth, moviesController.add_new_movie);

router.get('/:movie_id', moviesController.get_movie_by_id);

module.exports = router
