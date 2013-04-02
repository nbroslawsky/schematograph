var assert = require('chai').assert,
	Validator = require('../lib/validator'),
	schema = require('./sample-data/schema.js'),
	data = require('./sample-data/data.js');

describe('Entire Schema', function() {

	var validData = data(),
		validator = new Validator(schema);

	it('should validate with valid data', function() {
		var v = validator.validate(validData);

		assert.isTrue(v.success);
		assert.lengthOf(v.errors, 0);

		// assert all field results passed
		Object.keys(v.fieldResults).forEach(function(field) {
			assert.isTrue(v.fieldResults[field]);
		});

		// assert all validators for all fields passed
		Object.keys(v.results).forEach(function(field) {
			Object.keys(v.results[field]).forEach(function(validator) {
				assert.isTrue(v.results[field][validator]);
			});
		});

	});

	it('should be invalid with an empty object', function() {
		var v = validator.validate({});

		assert.isFalse(v.success);
	});

	it('should be invalid with a null value', function() {
		var v = validator.validate(null);

		assert.isFalse(v.success);
	});

	it('should be invalid with an undefined value', function() {
		var v = validator.validate(undefined);

		assert.isFalse(v.success);
	});

});
