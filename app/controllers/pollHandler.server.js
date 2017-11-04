'use strict';

var Poll = require('../models/poll.js');
var User = require('../models/user.js');

function CreatePoll () {

	this.createPoll = function (req, res) {
		var poll = new Poll({ name : req.body.name, label: req.body.label });
			poll.save(function (err, final) {
			 if (err) { throw err; }
				// saved!
			})
            res.json(final.id);
          });
		
		//~ Poll
			//~ .create({ 'github.id': req.user.github.id }, { '_id': false })
			//~ .exec(function (err, result) {
				//~ if (err) { throw err; }

				//~ res.json(result.nbrClicks);
			//~ });
	//~ };

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = ClickHandler;
