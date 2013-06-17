var assert = require('chai').assert,
	Validator = require('../lib/validator');

describe('Validator Types', function() {

	var validator = new Validator();

	describe('Number', function() {
		var obj = {},
			schema = {
				foo: {
					type: Number
				}
			};

		it('should fail for strings', function() {
			obj.foo = 'not a number';
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for NaN', function() {
			obj.foo = NaN;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for true', function() {
			obj.foo = true;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for false', function() {
			obj.foo = false;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for arrays', function() {
			obj.foo = [1,2,3];
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for dates', function() {
			obj.foo = new Date();
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for null', function() {
			obj.foo = null;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for undefined', function() {
			obj.foo = undefined;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for a number', function() {
			obj.foo = 1337;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for zero', function() {
			obj.foo = 0;
			assertValid(validator.validate(obj, schema), 'foo');
		});

	});

	describe('String', function() {
		var obj = {},
			schema = {
				foo: {
					type: String
				}
			};

		it('should pass for strings', function() {
			obj.foo = 'a string';
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for true', function() {
			obj.foo = true;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for false', function() {
			obj.foo = false;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for arrays', function() {
			obj.foo = [1,2,3];
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for dates', function() {
			obj.foo = new Date();
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for null', function() {
			obj.foo = null;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for undefined', function() {
			obj.foo = undefined;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for a number', function() {
			obj.foo = 1337;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

	});

	describe('Boolean', function() {
		var obj = {},
			schema = {
				foo: {
					type: Boolean
				}
			};

		it('should pass for true', function() {
			obj.foo = true;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for false', function() {
			obj.foo = false;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for strings', function() {
			obj.foo = 'a string';
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for arrays', function() {
			obj.foo = [1,2,3];
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for dates', function() {
			obj.foo = new Date();
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for null', function() {
			obj.foo = null;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for undefined', function() {
			obj.foo = undefined;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for a number', function() {
			obj.foo = 1337;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

	});

	describe('Date', function() {
		var obj = {},
			schema = {
				foo: {
					type: Date
				}
			};

		it('should pass for dates', function() {
			obj.foo = new Date();
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for true', function() {
			obj.foo = true;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for false', function() {
			obj.foo = false;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for strings', function() {
			obj.foo = 'a string';
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for arrays', function() {
			obj.foo = [1,2,3];
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for null', function() {
			obj.foo = null;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should pass for undefined', function() {
			obj.foo = undefined;
			assertValid(validator.validate(obj, schema), 'foo');
		});

		it('should fail for a number', function() {
			obj.foo = 1337;
			assertInvalid(validator.validate(obj, schema), 'foo');
		});

	});

	function assertValid(validation, field) {
		assert.isTrue(validation.success);
		assert.isTrue(validation.results[field].type);
		assert.isFalse(errorsContain(validation.errors, field, 'type'));
	}

	function assertInvalid(validation, field) {
		assert.isFalse(validation.success);
		assert.isFalse(validation.results[field].type);
		assert.isTrue(errorsContain(validation.errors, field, 'type'));
	}

	function errorsContain(errors, field, validator) {
		return errors.some(function(error) {
			return error.field === field && error.validator === validator;
		});
	}

});
