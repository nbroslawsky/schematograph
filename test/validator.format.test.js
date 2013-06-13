var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Format', function() {

	var validator = new Validator(),
		schema = { foo: { format: 'email' } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'format');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'format');
	});

});
