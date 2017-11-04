'use strict';

var Poll = require('../models/poll.js');
var User = require('../models/users.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.render('login', {title: 'Login | YouVote - Your Voting App'});
		}
	}
	app.route('/')
		.get(function (req, res) {
			res.render('home', {title: 'Home | YouVote - Your Voting App', req: req});
		});

	app.route('/poll').get(function (req, res) {
		res.render('poll', {title: 'Polls | YouVote - Your Voting App', req: req});
    });
    
    app.route('/my-poll').get(isLoggedIn, function (req, res) {
		res.render('my-poll', {title: 'My Polls | YouVote - Your Voting App', req: req });
    });

	app.route('/login')
		.get(isLoggedIn, function (req, res) {
			res.render('login', {title: 'Login | YouVote - Your Voting App', req: req});
		});

	app.route('/logout')
		.get(isLoggedIn, function (req, res) {
			req.logout();
			res.render('home', {title: 'Home | YouVote - Your Voting App', req: req});
		});

	app.route('/poll/new')
		.get(isLoggedIn, function (req, res) {
			res.render('create', {title: 'Create Polls | YouVote - Your Voting App', req: req});
		});

    app.route('/poll/:id').get(function (req, res) {
			Poll.findOne({ _id: req.params.id }, function (err, poll) {
				res.render('details', {title: 'Polls | YouVote - Your Voting App', req: req});
		});
    });
    
    app.route('/username/')
		.get(function (req, res) {
			if(req.isAuthenticated()) {
				res.json(req.user.github);
			} else {
				res.json({"status": "error"});
			}
			
	});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
	}));

    app.route('/poll/vote/:id').post(function (req, res) {
		//voted for poll
		
		const voteId = req.body.id;
		//const userIp = req.headers['x-forwarded-for'].split(',').shift();
		const userIp = '34.32.222.12';
		const user = '';
		if(req.isAuthenticated()) {
			user = req.user.github.username;
		}
		//const user = req.user.github.username || 'Guest';
		//const user = "test";
		const pollId = req.params.id;
		const voteKey = 'voting.label.'+ req.body.id + '.vote';
		console.log(user);
		
		var inc = {};
		inc[voteKey] = 1;
		inc["voting.total"] = 1;
		
		var push = {};
		push["voting.voted"] = { ip: userIp, username: user, label_id: voteId };

		const voting = {
			$inc: inc,
			$push: push,
			$set: {updatedAt: Date.now()},
		};
		//console.log(voting);
		
		Poll.find({
			  $and: [ { $or: [{"voting.voted.ip": userIp}, {"voting.voted.username": user}] },
						{"_id": pollId},
			  ]
		  }, function (err, results) {
			  //console.log(results);
			  if(err) { return res.status(500).send("Sorry, something goes wrong."); }
			  if(results) {
				 if(typeof results[0] !== "undefined") {
					//user already voted (per ip or username)
					res.status(500).send("Already voted! (Once per IP / User only)");
				 } else {
					 //user had not vote this poll before
					console.log("else results: "+ results);
					Poll.findOneAndUpdate({"_id": pollId}, voting, {safe: true, upsert: true, new : true}, function(err, poll) {
					if (err) {
						console.log(err);
						res.status(500).send("Sorry, something goes wrong.");
						}
						res.json(poll);
					});
				 }
			  }
		});
	});
	
	app.route('/poll/new/create')
		.post(isLoggedIn, function (req, res) {
			//create new poll
			var user = req.user.github.username;
			var name = req.body.label;
			console.log(name);
			var poll = new Poll({voting: { name : req.body.name, label: req.body.label }, author: user });
			poll.save(function (err, final) {
			 if (err) { console.log(err); }
				// saved!
				//console.log('saved, id: ' + final.id);
				res.json(final.id);
			});
         });
	
	app.route('/poll/vote/new/:id').post(function (req, res) {
		//create new options for poll
		const optionId = req.body.id;
		const optionName = req.body.name;
		const pollId = req.params.id;
		
		var item = {};
		item["voting.label"] = { "id": optionId, "name": optionName };

		const voting = {
			$addToSet: item,
			$set: {updatedAt: Date.now()},
		};
		Poll.find({"_id": pollId, "voting.label.name": optionName }, function(err, poll) {
			if (err) {
				console.log(err);
				res.status(500).send();
				}
			if(poll) {
				console.log(typeof poll[0]);
				if(typeof poll[0] !== "undefined") {
					//same option existed
					res.status(404).send("Sorry, same option existed.");
				} else {
					//create new option
					Poll.findOneAndUpdate({"_id": pollId}, voting, {safe: true, upsert: true, new : true}, function(err, vote) {
					if (err) {
						console.log(err);
						res.status(500).send();
						}
						res.json(pollId);
					});
				}
			}
		});
	});
    
    app.route('/poll/find/:id').get(function (req, res) {
		console.log('# Get details of poll.');
			Poll.findOne({ _id: req.params.id }, function (err, poll) {
				res.json(poll);
		});
    });
    
    app.route('/poll/get/all').get(function (req, res) {
		console.log(req.query.type);
		console.log(req.query.num);
		console.log('# Get all poll.');
		if(req.query.type == "all") {
			//get all polls
			Poll.find({}, null, {sort: {'createdAt': -1}}, function (err, poll) {
				res.json(poll);
			});
		} else if (req.query.type =="latest") {
			console.log(req.query.type);
			if(parseInt(req.query.num)) {
				Poll.find({}, null, {sort: {'updatedAt': -1}, limit: parseInt(req.query.num)}, function (err, poll) {
					if(poll) {
						console.log(poll);
						res.json(poll);
					} else if(err) {
						res.json({"status": "Error"});
					}
					
				});
			} else {
				res.json({"status": "Error"});
			}
		}
			
    });

    app.route('/poll/get/mypoll').get(function (req, res) {
		const user = req.user.github.username;
		
		console.log('# Get poll created by user.');
			Poll.find({ author: user }, null, {sort: {'createdAt': -1}}, function (err, poll) {
				res.json(poll);
		});
    });

};
