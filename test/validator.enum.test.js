var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Enum', function() {

	var validator = new Validator(),
		schema = { foo: { enum: ['foo', 'bar'] } };

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'enum');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'enum');
	});

});
