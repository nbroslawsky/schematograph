var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Max', function() {

	var validator = new Validator(),
		schema = { foo: { max: 1 } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'max');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'max');
	});

});
