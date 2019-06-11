const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const User = require('../models/user.js');

exports.get_all_users = (req, res, next) => {
  User.find()
    .then(users => {
	if(users.length<1){
	  return res.status(404).json({
	    message: 'users not found'
	  }) 
	}
	res.status(200).json({
	  users: users
	})
    })
    .catch(err => {
	res.status(500).json({
	  error: err
	})
    })
};

exports.get_user_by_id = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
	if(user.length<1){
	  return res.status(404).json({
	    message: 'user not found'
	  }) 
	}
	res.status(200).json({
	  _id: user.id,
	  email: user.email
	})
    })
    .catch(err => {
	res.status(500).json({
	  error: err
	})
    })
};

exports.sign_up = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(result => {
	    console.log('zzzz')
      if(result.length > 0){
	return res.status(409).json({
	  message: 'user already exist'
	})
      }
      bcrypt.hash(req.body.password, 10, (err, hash) =>{
	if(err){
	  return res.status(500).json({
	    error: err
	  })
	}
	console.log('zzzz')
	console.log(new mongoose.Types.ObjectId)
	const user = new User({
	  _id: new mongoose.Types.ObjectId,
	  email: req.body.email,
	  password: hash
	})
	user.save()
	  .then(created_user => {
	    res.status(201).json({
		message: 'user created',
		_id: created_user._id
	    })
	  })
	  .catch(err => {
	    res.status(500).json({
	      error: err
	    })
	  })
      })
    })
    .catch(err => {
	res.status(500).json({
	  error: err
	})
    })

};

exports.login = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(data => {
	if(!data || data.length<1){
	  return res.status(401).json({
	    message: 'Auth Failed'
	  })
	}
	bcrypt.compare(req.body.password, data[0].password, (err, result) => {
	  if(err) {
	    return res.status(401).json({
		message: 'Auth Failed'
	    })
	  }
	  if(result){
	    const token = jwt.sign(
	      {
		email: data[0].email,
		userId: data[0]._id
	      }, 
	      process.env.JWT_KEY,
	      {
		expiresIn: "1h"
	      }
	    )
	    return res.status(200).json({
	      message: 'Login Success',
	      token: token
	    })
	  }
          res.status(401).json({
	    message: 'Auth Failed'
	  })
	})
    })
    .catch(err => {
	res.status(500).json({
	  error: err
	})
    })
};
