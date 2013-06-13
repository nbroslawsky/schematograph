var assert = require('./assert'),
	Validator = require('../lib/validator');

describe('Validator Each', function() {

	var validator = new Validator(),
		schema = {
			foo: {
				each: {
					type: Number,
					max: 100
				}
			}
		};

	it('should ignore an undefined value', function() {
		assert.valid(validator.validate({ foo : undefined }, schema), 'foo', 'each');
	});

	it('should ignore a null value', function() {
		assert.valid(validator.validate({ foo : null }, schema), 'foo', 'each');
	});

});
