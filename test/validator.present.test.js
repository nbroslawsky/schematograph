var assert = require('chai').assert,
	Validator = require('../lib/validator');

describe('Present', function() {
	var obj = {};

	describe('Type String', function() {
		var schema = {
				foo: {
					type: String,
					present: true
				}
			},
			validator = new Validator(schema);

		it('should fail for undefined', function(){
			obj.foo = undefined;
			var v = validator.validate(obj);
			assert.isFalse(v.success);
		});

		it('should fail for null', function(){
			obj.foo = null;
			var v = validator.validate(obj);
			assert.isFalse(v.success);
		});

		it('should fail for empty strings', function(){
			obj.foo = '';
			var v = validator.validate(obj);
			assert.isFalse(v.success);
		});

		it('should pass for a string', function(){
			obj.foo = 'a string';
			var v = validator.validate(obj);
			assert.isTrue(v.success);
		});

	});

});
