var assert = require('chai').assert,
	Validator = require('../lib/validator');

describe('oneOf', function() {

	var schemaA = {
			type: {
				type: String,
				present: true
			},
			body: {
				type: String,
				present: true
			}
		},
		schemaB = {
			type: {
				type: String,
				present: true
			},
			url: {
				type: String,
				present: true
			}
		},
		schema = {
			assets: {
				type: Array,
				oneOf: [
					schemaA,
					schemaB
				]
			}
		},
		validator = new Validator(schema);

	it.only('should validate with one correct entry', function() {
		var nested = { type: 'text', body: 'some stuff' },
			obj = {
				assets: [ nested ]
			};

			var v = validator.validate(obj);
			assert.isTrue(v.success);
	});

	it('should NOT validate without a correct entry', function() {
		var nested = { badProp: 'text', body: 'some stuff' },
			obj = {
				assets: [ nested ]
			};

			var v = validator.validate(obj);
			assert.isFalse(v.success);
	});

	it('should validate with two of the same correct entries', function() {
		var nestedOne = { type: 'text', body: 'some stuff' },
			nestedTwo = { type: 'text', body: 'some more stuff' },
			obj = {
				assets: [ nestedOne, nestedTwo ]
			};

			var v = validator.validate(obj);
			assert.isTrue(v.success);
	});

	it('should validate with two different and correct entries', function() {
		var nestedOne = { type: 'text', body: 'some stuff' },
			nestedTwo = { type: 'image', url: 'http://www.somedomain.com' },
			obj = {
				assets: [ nestedOne, nestedTwo ]
			};

			var v = validator.validate(obj);
			assert.isTrue(v.success);
	});

	it('should NOT validate with two different and incorrect entries', function() {
		var nestedOne = { type: 'text', badProp: 'some stuff' },
			nestedTwo = { type: 'image', invalid: 'some more stuff' },
			obj = {
				assets: [ nestedOne, nestedTwo ]
			};

			var v = validator.validate(obj);
			assert.isFalse(v.success);
	});

});
