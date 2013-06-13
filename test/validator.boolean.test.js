var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Boolean', function() {

	var validator = new Validator(),
		schema = { foo: { boolean: true } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'boolean');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'boolean');
	});

});
