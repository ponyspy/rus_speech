var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Unit = Model.Unit;

	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.unit_id;

		Unit.findById(id).exec(function(err, unit) {
			if (err) return next(err);

			res.render('admin/units/edit.pug', { unit: unit });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.unit_id;

		Unit.findById(id).exec(function(err, unit) {
			if (err) return next(err);

			unit.status = post.status;
			unit.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& unit.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& unit.setPropertyLocalised('description', post[locale].description, locale);
			});

			async.series([
				async.apply(uploadFile, unit, 'units', 'attach', files.attach && files.attach[0], post.attach_del),
				async.apply(uploadFile, unit, 'units', 'preview', files.preview && files.preview[0], post.preview_del),
			], function(err, results) {
				if (err) return next(err);

				unit.save(function(err, unit) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};