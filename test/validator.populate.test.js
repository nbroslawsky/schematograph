var assert = require('chai').assert,
	Validator = require('../lib/validator');

describe('Validator Populate', function() {

	var validator = new Validator();

	describe('Array', function() {
		var schema = {
				bar: {
					type: Array,
					populate : []
				}
			};

		it('should populate bar as an array', function() {
			var obj = {};
			assertValid(validator.validate(obj, schema), 'bar');
		});
	});


	describe('Real Metrics Data', function() {

		var schema = {
			data : {
				schema : {
					eCPE : { populate : {} },
					engagement : {
						schema : {
							tumblr : {
								schema : {
									earned : { populate : {} },
									paid : { populate : {} }
								}
							},
							yahoo : {
								schema : {
									earned : { populate : {} },
									paid : { populate : {} }
								}
							}
						}
					},
					followers : { populate : {} },
					impressions : {
						schema : {
							tumblr : { populate : {} },
							yahoo : { populate : {} }
						}
					},
					spend : {
						schema : {
							tumblr : { populate : {} },
							yahoo : { populate : {} }
						}
					}
				}
			}
		};

		var fullMetrics = require('./sample-data/populate.metrics.json'),
			partialMetrics = require('./sample-data/populate.metrics-partial.json');

		it('should be valid for a complete data set', function() {
			assertValid(validator.validate(fullMetrics, schema));
		});

		it('should be valid for an incomplete data set', function() {
			assertValid(validator.validate(partialMetrics, schema));
			assert.isDefined(partialMetrics.data.impressions.tumblr);
		});
	});

	describe('Real Metrics Data 2', function() {

		var schema = {
			"engagement": {
				"schema": {
					"tumblr": {
						"schema": {
							"earned": {
								"populateMissing": {}
							},
							"paid": {
								"populateMissing": {}
							}
						}
					},
					"yahoo": {
						"schema": {
							"earned": {
								"populateMissing": {}
							},
							"paid": {
								"populateMissing": {}
							}
						}
					}
				}
			},
			"followers": {
				"populateMissing": {}
			},
			"impressions": {
				"schema": {
					"tumblr": {
						"populateMissing": {}
					},
					"yahoo": {
						"populateMissing": {}
					}
				}
			},
			"spend": {
				"schema": {
					"tumblr": {
						"populateMissing": {}
					},
					"yahoo": {
						"populateMissing": {}
					}
				}
			}
		};

		var metrics = require('./sample-data/populate.metrics-2.json');

		it('should be valid for a complete data set', function() {
			assertValid(validator.validate(metrics, schema));
			assert.isNotNull(metrics.engagement.tumblr.paid);
		});

	});

	describe('Real Timeseries Data', function() {

		var schema = {
			data : {
				schema : {
					timeseries : {
						schema : {
							engagement : {
								schema : {
									tumblr : {
										populate : Array,
										each : {
											schema : {
												earned : { populate : {} },
												paid : { populate : {} },
											}
										}
									},
									yahoo : {
										populate : Array,
										each : {
											schema : {
												earned : { populate : {} },
												paid : { populate : {} },
											}
										}
									}
								}
							},
							followers : {
								schema : {
									tumblr : {
										populate : Array
									},
									yahoo : {
										populate : Array
									}
								}
							},
							impressions : {
								schema : {
									tumblr : {
										populate : Array
									},
									yahoo : {
										populate : Array
									}
								}
							},
							spend : {
								schema : {
									tumblr : {
										populate : Array
									},
									yahoo : {
										populate : Array
									}
								}
							}
						}
					}
				}
			}
		};

		var fullTimeseries = require('./sample-data/populate.timeseries.json'),
			partialTimeseries = require('./sample-data/populate.timeseries-partial.json');

		it('should be valid for a complete data set', function() {
			assertValid(validator.validate(fullTimeseries, schema));
		});

		it('should be valid for an incomplete data set', function() {
			assertValid(validator.validate(partialTimeseries, schema));
			assert.isDefined(partialTimeseries.data.timeseries.engagement.yahoo);
		});
	});

	describe('Real Timeseries Data 2', function() {

		var schema = {
			"timeseries": {
				"schema": {
					"engagement": {
						"schema": {
							"tumblr": {
								"populate": [],
								"each": {
									"schema": {
										"earned": {
											"populate": {}
										},
										"paid": {
											"populate": {}
										}
									}
								}
							},
							"yahoo": {
								"populate": [],
								"each": {
									"schema": {
										"earned": {
											"populate": {}
										},
										"paid": {
											"populate": {}
										}
									}
								}
							}
						}
					},
					"followers": {
						"populate": []
					},
					"impressions": {
						"schema": {
							"tumblr": {
								"populate": []
							},
							"yahoo": {
								"populate": []
							}
						}
					},
					"spend": {
						"schema": {
							"tumblr": {
								"populate": []
							},
							"yahoo": {
								"populate": []
							}
						}
					}
				}
			}
		};

		var timeseries = require('./sample-data/populate.timeseries-2.json');

		it('should be valid for a real-world example', function() {
			assertValid(validator.validate(timeseries, schema));
			assert.isArray(timeseries.timeseries.engagement.yahoo);
			assert.isArray(timeseries.timeseries.engagement.tumblr);
		});
	});

	function assertValid(validation, field) {
		assert.isTrue(validation.success);
		if(field) {
			assert.isTrue(validation.results[field].type);
			assert.isFalse(errorsContain(validation.errors, field, 'type'));
		}
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
