var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Unit = Model.Unit;

	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;;


	module.index = function(req, res, next) {
		res.render('admin/units/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var unit = new Unit();

		unit._short_id = shortid.generate();
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
			async.apply(uploadFile, unit, 'units', 'attach', files.attach && files.attach[0], null),
			async.apply(uploadFile, unit, 'units', 'preview', files.preview && files.preview[0], null),
		], function(err, results) {
			if (err) return next(err);

			unit.save(function(err, unit) {
				if (err) return next(err);

				res.redirect('/admin/units');
			});
		});
	};


	return module;
};