var assert = require('chai').assert,
	Validator = require('../lib/validator');

describe('Validator Values', function() {

	var validator = new Validator();

	var obj = {};

	it('should match the right string', function() {
		var schema = { foo: { value: 'bar' } };
		obj.foo = 'bar';
		assertValid(validator.validate(obj, schema), 'foo');
	});

	it('should match the right number', function() {
		var schema = { foo: { value: 1 } };
		obj.foo = 1;
		assertValid(validator.validate(obj, schema), 'foo');
	});

	it('should no coerce the number', function() {
		var schema = { foo: { value: '1' } };
		obj.foo = 1;
		assertInvalid(validator.validate(obj, schema), 'foo');
	});

	it('should no coerce falsey items', function() {
		assertInvalid(validator.validate({ foo : null }, { foo: { value: '' } }), 'foo');
		assertInvalid(validator.validate({ foo : undefined }, { foo: { value: '' } }), 'foo');
		assertInvalid(validator.validate({ foo : 0 }, { foo: { value: '' } }), 'foo');
		assertInvalid(validator.validate({ foo : false }, { foo: { value: '' } }), 'foo');

	});

	function assertValid(validation, field) {
		assert.isTrue(validation.success);
		assert.isTrue(validation.results[field].value);
		assert.isFalse(errorsContain(validation.errors, field, 'value'));
	}

	function assertInvalid(validation, field) {
		assert.isFalse(validation.success);
		assert.isFalse(validation.results[field].value);
		assert.isTrue(errorsContain(validation.errors, field, 'value'));
	}

	function errorsContain(errors, field, validator) {
		return errors.some(function(error) {
			return error.field === field && error.validator === validator;
		});
	}

});