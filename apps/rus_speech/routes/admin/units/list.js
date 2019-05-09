var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Unit = Model.Unit;


	module.index = function(req, res, next) {
		Unit.find().sort('-date').limit(10).exec(function(err, units) {
			if (err) return next(err);

			Unit.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/units', {units: units, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Unit.find({ $text : { $search : post.context.text } } )
			: Unit.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, units) {
				if (err) return next(err);

				if (units.length > 0) {
					var opts = {
						units: units,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/units/_units.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};