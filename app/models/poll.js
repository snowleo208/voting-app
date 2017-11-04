'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Voted = new Schema({
	ip: { type: String, trim: true },
	username: { type: String },
	label_id: { type: String, trim: true },
	poll_id: { type: String, trim: true },
});

var Poll = new Schema({
	voting: {
		name: { type: String, trim: true, default: "New voting", required: true },
		label: [{
			id: { type: Number, trim: true, required: true },
			name: { type: String, required: true },
			vote: { type: Number, required: true, default: 0 },
		}],
		voted: [{
			ip: { type: String, trim: true },
			username: { type: String },
			label_id: { type: String, trim: true },
		}],
		total: { type: Number, trim: true, required: true, default: 0 },
		draft: { type: Boolean, default: false },
	},
   author: { type: String },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Poll', Poll);
