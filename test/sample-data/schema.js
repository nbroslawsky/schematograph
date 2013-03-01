module.exports = {
	// Not sure we'd defined id in here, as it doesn't exist initially, and is never set manually
	id: {
		type: Number,
		required: true
	},
	uuid: {
		type: String,
		required: true,
		// no clue if this pattern is right, but supporting patterns would be good
		pattern: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
	},
	guid: {
		type: String,
		required: true,
		// or maybe a simple way to pre-define common formats [uuid,email,uri]?
		format: 'uuid'
	},
	headline: {
		type: String,
		// also means !== '', or a separate notEmpty that means this?
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
		// if not required, doesn't enforce property is defined
		required: false
	},
	type: {
		type: String,
		// is `enum` the right name?  maybe `oneOf`?
		enum: ['article', 'image', 'slideshow', 'video'],
		required: true
	},
	createdDate: {
		type: Date,
		required: true
	},
	foobar: {
		// do we want/need to enforce a `type` if a validator is applied?  Could be nice for Dates
		type: String,
		// let's require synchronous validation, simplifies everything and should be sufficient
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
			// because type is Date, I can expect it to be a valid Date, otherwise this doesn't run?
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
