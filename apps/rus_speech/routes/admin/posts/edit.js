var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Post = Model.Post;
	var Category = Model.Category;
	var Unit = Model.Unit;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;
	var uploadImagesContent = Params.upload.image_content;


	module.index = function(req, res, next) {
		var id = req.params.post_id;

		Post.findById(id).exec(function(err, p_item) {
			if (err) return next(err);

			Category.find().exec(function(err, categorys) {
				if (err) return next(err);

				Unit.find().exec(function(err, units) {
					if (err) return next(err);

					res.render('admin/posts/edit.pug', { post: p_item, categorys: categorys, units: units });
				});
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.post_id;

		Post.findById(id).exec(function(err, p_item) {
			if (err) return next(err);

			p_item.status = post.status;
			p_item.sym = post.sym ? post.sym : undefined;
			p_item.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			p_item.categorys = post.categorys.filter(function(category) { return category != 'none'; });
			p_item.units = post.units.filter(function(unit) { return unit != 'none'; });

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& p_item.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 's_title'])
					&& p_item.setPropertyLocalised('s_title', post[locale].s_title, locale);

				checkNested(post, [locale, 'intro'])
					&& p_item.setPropertyLocalised('intro', post[locale].intro, locale);

			});

			async.series([
				async.apply(uploadImage, p_item, 'posts', 'poster', 600, files.poster && files.poster[0], post.poster_del),
				async.apply(uploadImagesContent, p_item, post, 'posts', checkNested(post, ['ru', 'description']) ? 'ru' : false),
				async.apply(uploadImagesContent, p_item, post, 'posts', checkNested(post, ['en', 'description']) ? 'en' : false),
			], function(err, results) {
				if (err) return next(err);

				p_item.save(function(err, p_item) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};