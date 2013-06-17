var formats = require('./formats.js');

function Validator(schema) {
	this.schema = schema;
}

Validator.prototype = {
	setFormattingLibrary : function() {},
	validate : function(data, schema) {

		schema = schema || this.schema;

		var self = this,
			success = true,
			errors = [],
			fieldResults = {},
			testResults = Object.keys(schema).reduce(function(results, field) {
				var fieldConfigs = (schema[field] instanceof Array)
					? schema[field]
					: (schema[field] ? [schema[field]] : []);

				var verdict = fieldConfigs.some(function(fieldConfig) {

					var localSuccess = true;

					results[field] = Object.keys(fieldConfig)
						.reduce(function(init, funcName) {

							var validator = self.validators[funcName],
								v = validator ? !!validator.call(self, fieldConfig[funcName], data && data[field]) : true;
							localSuccess &= v;
							init[funcName] = v;

							if(!v) {
								errors.push({ field : field, validator : funcName });
							}

							return init;
						}, {});

					return localSuccess;
				});

				fieldResults[field] = verdict;
				success &= verdict;

				return results;
			}, {});

		return {
			results : testResults,
			success : !!success,
			fieldResults : fieldResults,
			errors : errors
		};

	},

	validators : {
		type : function(target, value) {
			if(value === undefined || value === null) return true;
			if(target === Number && isNaN(value)) return false;

			return (typeof(target) == 'string')
				? (target == typeof value)
				: (value.constructor === target);
		},
		required : function(target, value) {
			return target ? (value !== undefined) : true;
		},
		present: function(target, value) {
			return !!target ? (value !== undefined && value !== null && value !== '') : true;
		},
		pattern : function(target, value) {
			if(value === undefined || value === null) return true;

			if(!(target instanceof RegExp)) {
				throw new Error('Validator pattern must be a regex!');
			}
			return target.test(value);
		},
		format : function(target, value) {
			if(value === undefined || value === null) return true;

			var formatValidator = formats[target];
			if(!formatValidator) {
				throw new Error("'" + target + "' is not a defined formatting validator");
			}

			return !!formatValidator(value);
		},
		notNull : function(target, value) {
			return target
				? ((value !== null) && (value !== undefined))
				: true;
		},
		max : function(target, value) {
			if(value === undefined || value === null) return true;

			if(value && value.length) {
				return value.length <= target;
			}
			return value <= target;
		},
		min : function(target, value) {
			if(value === undefined || value === null) return true;

			if(value && value.length) {
				return value.length >= target;
			}
			return value >= target;
		},
		boolean : function(target, value) {
			if(value === undefined || value === null) return true;

			return !target || (!!value === value);
		},
		each : function(target, value) {

			if(!(value instanceof Array)) { return true; }

			var self = this,
				results = Object.keys(target)
					.reduce(function(init, funcName) {
						var localSuccess = true;
						var verdicts = value.map(function(item) {
							var validator = self.validators[funcName],
								verdict = validator ? !!validator.call(self, target[funcName], item) : true;
							localSuccess &= verdict;
							return verdict;
						});

						init[funcName] = localSuccess;
						return init;
					}, {});

			return Object.keys(results).reduce(function(init, v) { return init & !!results[v]; }, 1);
		},
		unique : function(target, value) {
			if(value instanceof Array) {
				var obj = value.reduce(function(init, v) {
					init[v] = true;
					return init;
				}, {});

				return Object.keys(obj).length == value.length;
			}
			return true;
		},
		enum : function(target, value) {
			if(value === undefined || value === null) return true;

			if(!(target instanceof Array)) {
				throw new Error("Enum value must be an array");
			}
			return !!~target.indexOf(value);
		},
		validator : function(target, value) {
			if(value === undefined || value === null) return true;

			return target.call(this, value);
		},
		value : function(target, value) {
			if(value === undefined || value === null) return true;

			return value === target;
		},
		schema : function(target, value) {
			// null/undefined values aren't enforced w/ schemas
			if(value === null || value === undefined) return true;

			return this.validate(value, target).success;
		},
		oneOf : function(schemas, value) {

			var rValues = (value instanceof Array) ? value : [value];
			var rSchemas = (schemas instanceof Array) ? schemas : [schemas];
			var self = this;
			return rValues.every(function(value) {
				return rSchemas.some(function(schema) {
					return self.validators.schema.call( self, schema, value );
				});
			});
		}
	}
};

Validator.validate = function(schema, data) {
	var v = new Validator(schema);
	return v.validate(data);
};

module.exports = Validator;
