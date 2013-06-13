var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Validator', function() {

	var validator = new Validator(),
		schema = { foo: { validator: function(value) { return value === 'foobar'; } } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'validator');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'validator');
	});

});
