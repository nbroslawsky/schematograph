schematograph
=========

[![Build Status](https://secure.travis-ci.org/nbroslawsky/schematograph.png?branch=master)](http://travis-ci.org/nbroslawsky/schematograph)

Javascript Schema Validation Library

## Sample Schema

```
module.exports = {
	id: {
		type: Number,
		required: true
	},
	uuid: {
		type: String,
		required: true,
		pattern: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
	},
	guid: {
		type: String,
		required: true,
		format: 'uuid'
	},
	headline: {
		type: String,
		notNull: true,
		max: 200,
		min: 10,
		required: true
	},
	summary: {
		type: String,
		notNull: true,
		required: true
	},
	contents: [{
		type: String,
		notNull: true,
		required: true
	}],
	media: {
		type: Array,
		min: 1,
		max: 10,
		required: false
	},
	type: {
		type: String,
		enum: ['article', 'image', 'slideshow', 'video'],
		required: true
	},
	createdDate: {
		type: Date,
		required: true
	},
	foobar: {
		type: String,
		validator: function(value) {
			return value === 'theonlythingiaccept';
		}
	},
	ints: {
		each: {
			type: Number,
			max: 100
		}
	},
	isValid: {
		type: Boolean,
		boolean: true
	},
	publishDate: {
		type: Date,
		validator: function(value) {
			return Date.parse(value) > Date.parse('Thu Feb 28 2013 12:46:24 GMT-0700 (MST)');
		}
	},
	nested: {
		schema : {
			hello : {
				type: String,
				required: true
			}
		}
	}
};
```
