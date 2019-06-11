const mongoose = require("mongoose");
const Movies = require('../models/movies');

exports.get_all_movies =  (req, res, next) => {
  Movies.find()
    .exec()
    .then(docs => {
      res.status(200).json({
	data: docs
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.get_movie_by_id = (req, res, next) => {
  Movies.findById(req.params.movie_id)
    .then(movie => {
      if(!movie){
	 return res.status(404).json({
	    message: "movie not found"
	  })
      }
      res.status(200).json({
	movie: movie
      })
    })
    .catch(err => {
      res.status(500).json({
	  error: err
	})
    })
};

exports.add_new_movie =  (req, res, next) => {
  Movies.findOne({name: req.body.name})
    .then(movie => {
	if(movie){
	  return res.status(404).json({
	    message: "movie not found"
	  })
	}
	const new_movie = new Movies({
	  _id: mongoose.Types.ObjectId(),
	  name: req.body.name
	})
	return new_movie.save()
    })
    .then(result => {
	res.status(201).json({
	  message: 'movie created',
	  createMovie: result,
	  request: {
	    type: 'GET',
	    url: 'http://localhost:5000/movies/' + result._id
	  }
	})
    })
    .catch(err => {
	res.status(500).json({
	  error: err
	})
    })
};
