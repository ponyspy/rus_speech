var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Member = Model.Member;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.member_id;

		Member.findById(id).exec(function(err, member) {
			if (err) return next(err);

			res.render('admin/members/edit.pug', { member: member });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.member_id;

		Member.findById(id).exec(function(err, member) {
			if (err) return next(err);

			member.status = post.status;
			member.email = post.email;
			member.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'name'])
					&& member.setPropertyLocalised('name', post[locale].name, locale);

				checkNested(post, [locale, 'intro'])
					&& member.setPropertyLocalised('intro', post[locale].intro, locale);
			});

			async.series([
				async.apply(uploadImage, member, 'members', 'photo', 300, files.photo && files.photo[0], post.poster_del),
			], function(err, results) {
				if (err) return next(err);

				member.save(function(err, member) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};