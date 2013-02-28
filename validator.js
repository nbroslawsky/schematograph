var f = (function() {

	return {
		uuid : function(value) {
			return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value);
		}
	};

})();

var v = (function() {

	function Validator(schema) {
		this.schema = schema;
	}

	Validator.prototype = {
		setFormattingLibrary : function() {},
		validate : function(data, schema) {

			var schema = schema || this.schema;

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

								var v = !!self.validators[funcName].call(self, fieldConfig[funcName], data[field]);
								localSuccess &= v;
								init[funcName] = v;

								if(!v) {
									// errors.push("'"+field+"' failed on '"+funcName+"'");
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
				success : success,
				fieldResults : fieldResults,
				errors : errors
			};

		},

		validators : {
			type : function(target, value) {

				if(value === undefined || value === null) { return true; }
				return (typeof(target) == 'string')
					? (target == typeof value)
					: (value.constructor === target);
			},
			required : function(target, value) {
				return target ? (value !== undefined) : true;
			},
			pattern : function(target, value) {
				if(!(target instanceof RegExp)) {
					throw new Error('Validator pattern must be a regex!');
				}
				return target.test(value);
			},
			format : function(target, value) {
				var formatValidator = f[target];
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
			max : function(target, value) { return value.length <= target; },
			min : function(target, value) { return value.length >= target; },
			boolean : function(target, value) { return !target || (!!value === value); },
			enum : function(target, value) {
				if(!(target instanceof Array)) {
					throw new Error("Enum value must be an array");
				}
				return !!~target.indexOf(value);
			},
			validator : function(target, value) {
				return target.call(this, value);
			},
			schema : function(target, value) {
				return this.validate(value, target).success;
			}
		}
	};

	Validator.validate = function(schema, data) {
		var v = new Validator(schema);
		return v.validate(data);
	};

	return Validator;

})();


var schema = {
	// Not sure we'd defined id in here, as it doesn't exist initially, and is never set manually
	id: {
		type: Number,
		required: true
	},
	uuid: {
		type: String,
		required: true,
		// no clue if this pattern is right, but supporting patterns would be good
		pattern: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
	},
	guid: {
		type: String,
		required: true,
		// or maybe a simple way to pre-define common formats [uuid,email,uri]?
		format: 'uuid'
	},
	headline: {
		type: String,
		// also means !== '', or a separate notEmpty that means this?
		notNull: true,
		max: 200,
		min: 10,
		required: true,
	},
	summary: {
		type: String,
		notNull: true,
		required: true,
	},
	contents: [{
		type: String,
		notNull: true,
		required: true,
	}],
	media: {
		type: Array,
		min: 1,
		max: 10,
		// if not required, doesn't enforce property is defined
		required: false
	},
	type: {
		type: String,
		// is `enum` the right name?  maybe `oneOf`?
		enum: ['article', 'image', 'slideshow', 'video'],
		required: true
	},
	createdDate: {
		type: Date,
		required: true
	},
	foobar: {
		// do we want/need to enforce a `type` if a validator is applied?  Could be nice for Dates
		type: String,
		// let's require synchronous validation, simplifies everything and should be sufficient
		validator: function(value) {
			return value === 'theonlythingiaccept';
		}
	},
	isValid: {
		type: Boolean,
		boolean: true
	},
	publishDate: {
		type: Date,
		validator: function(value) {
			// because type is Date, I can expect it to be a valid Date, otherwise this doesn't run?
			return Date.parse(value) > Date.parse('Thu Feb 28 2013 12:46:24 GMT-0700 (MST)');
		}
	},
	nested: {
		schema : {
			hello : {
				type: String,
				required: true
			}
		}
	}
}


var data = {
	id : "hello",
	uuid : '550e8400-e29b-41d4-a716-446655440000',
	guid : '550e8400-e29b-41d4-a716-446655440000',
	headline : 'This is my headline...',
	summary : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
	contents : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce bibendum ornare dui, eu facilisis ante sodales eu. Nullam id egestas velit. Curabitur luctus accumsan erat, sed adipiscing ante interdum ut. Ut vehicula fringilla sapien ut tincidunt. Integer eget leo est, venenatis tempus felis. Sed eget magna nisi. Nam lacus nunc, mattis et elementum sit amet, pharetra vel justo. Vivamus et justo quis urna accumsan porta non in massa. Donec tempus iaculis est, ut dictum massa aliquam vel. Proin vel lorem risus, eget elementum sapien.\n\
\n\
Quisque semper tellus at eros volutpat vel gravida lectus aliquam. Aenean faucibus elementum lacinia. Pellentesque tincidunt malesuada magna quis placerat. In nec quam magna. Phasellus ornare interdum tortor at tempus. Praesent ut pretium risus. Fusce vel odio augue, vulputate convallis justo. Nullam quam est, posuere quis sollicitudin eget, faucibus sed elit. Quisque sapien massa, imperdiet et imperdiet quis, porttitor a ipsum. Donec tempor, arcu rhoncus tempus accumsan, nisi sem imperdiet turpis, sed luctus ante tellus ac dolor. Donec laoreet neque augue, eu tempor turpis.\n\
\n\
Integer id elementum sapien. Mauris est sapien, aliquet aliquet bibendum at, dignissim id nunc. Nulla mattis enim pharetra nunc ultrices a accumsan leo volutpat. Integer pulvinar, enim id facilisis sodales, sapien orci aliquet urna, pulvinar mollis nunc velit vitae lectus. Ut venenatis, eros ut fermentum blandit, dui felis auctor felis, vel porta est purus ut turpis. Vestibulum at leo tortor, vel fermentum arcu. Cras diam nunc, congue in dapibus a, porta non enim. Vestibulum blandit risus vel dui gravida et commodo lectus lacinia. Vestibulum nec tortor sit amet odio suscipit dignissim. Fusce dictum, felis sed suscipit tincidunt, purus purus sollicitudin elit, sit amet viverra libero lorem id felis. Suspendisse lobortis laoreet neque eu pharetra. Vestibulum congue faucibus libero in aliquam. Sed nec felis ornare ante vestibulum bibendum. Maecenas libero purus, congue et viverra eget, placerat non leo. Integer molestie porttitor mi a pellentesque. Aenean molestie, dui et convallis rhoncus, libero eros venenatis est, pulvinar fringilla tellus metus eleifend urna.",
	media : ['650e8400-e29b-41d4-a716-446655440000','750e8400-e29b-41d4-a716-446655440000','850e8400-e29b-41d4-a716-446655440000'],
	type : 'article',
	createdDate : new Date(),
	foobar : 'theonlythingiaccept',
	publishDate : new Date(),
	isValid : false,
	nested : {
		hello : 'thar'
	}
};


console.log(v.validate(schema, data));
