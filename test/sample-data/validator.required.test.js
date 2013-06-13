var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Required', function() {

	var validator = new Validator(),
		schema = { foo: { required: true } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'required');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'required');
	});

});
