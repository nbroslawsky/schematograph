var assert = require('chai').assert,
	Validator = require('../lib/validator');

describe('oneOf', function() {

	var schema = {
			assets: {
				type: Array,
				oneOf: [{
					type: {
						type: String,
						present: true
					},
					body: {
						type: String,
						present: true
					}
				},{
					type: {
						type: String,
						present: true
					},
					url: {
						type: String,
						present: true
					}
				}]
			}
		},
		validator = new Validator(schema);

	it('should validate with one correct entry', function() {
		var obj = {
				assets: [{
					type: 'text',
					body: 'some stuff'
				}]
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
