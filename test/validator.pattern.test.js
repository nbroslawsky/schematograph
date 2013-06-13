var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Pattern', function() {

	var validator = new Validator(),
		schema = { foo: { pattern: /foobar/ } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'pattern');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'pattern');
	});

});
