// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var passport = require('passport');

// Create a new comment
router.post('/new', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    var comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        text: req.body.text,
        created: req.body.created,
        post: req.body.post
    });

    comment.save(function(err) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

// Get all comments
router.get('/', function(req, res, next) {
    Comment.find(function(err, comments) {
        if (err) {
            return next(err);
        }
        res.json(comments);
    });
});

// Get a comment by id
router.get('/:id', function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

// Update a comment by id
router.put('/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            return next(err);
        }
        comment.user = req.body.user;
        comment.text = req.body.text;
        comment.created = req.body.created;
        comment.post = req.body.post;
        comment.save(function(err) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
});

// Delete a comment by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    Comment.findByIdAndRemove(req.params.id, req.body, function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

module.exports = router;