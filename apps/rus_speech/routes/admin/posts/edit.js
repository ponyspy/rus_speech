var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Post = Model.Post;
	var Category = Model.Category;

	var uploadImage = Params.upload.image;
	var filesUpload = Params.upload.files_upload;
	var filesDelete = Params.upload.files_delete;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.post_id;

		Post.findById(id).exec(function(err, p_item) {
			if (err) return next(err);

			Category.find().exec(function(err, categorys) {
				if (err) return next(err);

				res.render('admin/posts/edit.pug', { post: p_item, categorys: categorys });
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
			p_item.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			p_item.categorys = post.categorys.filter(function(category) { return category != 'none'; });

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& p_item.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 's_title'])
					&& p_item.setPropertyLocalised('s_title', post[locale].s_title, locale);

				checkNested(post, [locale, 'description'])
					&& p_item.setPropertyLocalised('description', post[locale].description, locale);
			});

			async.series([
				async.apply(uploadImage, p_item, 'posts', 'poster', 600, files.poster && files.poster[0], post.poster_del),
				async.apply(filesDelete, p_item, 'files', post, files),
				async.apply(filesUpload, p_item, 'posts', 'files', post, files),
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