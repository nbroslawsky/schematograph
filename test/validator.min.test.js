var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Min', function() {

	var validator = new Validator(),
		schema = { foo: { min: 1 } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'min');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'min');
	});

});
