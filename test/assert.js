var assert = require('chai').assert;

exports.valid = function(validation, field, type) {
	assert.isTrue(validation.success, 'should be successful');
	assert.isTrue(validation.results[field][type], 'field should be valid in results');
	assert.isFalse(errorsContain(validation.errors, field, type));
};

exports.invalid = function(validation, field, type) {
	assert.isFalse(validation.success);
	assert.isFalse(validation.results[field][type]);
	assert.isTrue(errorsContain(validation.errors, field, type));
};

function errorsContain(errors, field, validator) {
	return errors.some(function(error) {
		return error.field === field && error.validator === validator;
	});
}
