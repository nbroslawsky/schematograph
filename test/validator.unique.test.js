var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Unique', function() {

	var validator = new Validator(),
		schema = { foo: { unique: true } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'unique');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'unique');
	});

});
