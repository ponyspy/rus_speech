var fs = require('fs');
var async = require('async');

exports.edit = function(req, res) {
	async.series({
		about_title_ru: function(callback) {
			fs.readFile(__app_root + '/static/about_title_ru.html', 'utf8', callback);
		},
		about_title_en: function(callback) {
			fs.readFile(__app_root + '/static/about_title_en.html', 'utf8', callback);
		},
		about_desc_ru: function(callback) {
			fs.readFile(__app_root + '/static/about_desc_ru.html', 'utf8', callback);
		},
		about_desc_en: function(callback) {
			fs.readFile(__app_root + '/static/about_desc_en.html', 'utf8', callback);
		},
		lessons_title_ru: function(callback) {
			fs.readFile(__app_root + '/static/lessons_title_ru.html', 'utf8', callback);
		},
		lessons_title_en: function(callback) {
			fs.readFile(__app_root + '/static/lessons_title_en.html', 'utf8', callback);
		}
	}, function(err, results) {
		res.render('admin/cv.pug', { content: results });
	});
};

exports.edit_form = function(req, res) {
	var post = req.body;

	async.series({
		about_title_ru: function(callback) {
			if (!post.about_title.ru) return callback(null);

			fs.writeFile(__app_root + '/static/about_title_ru.html', post.about_title.ru, callback);
		},
		about_title_en: function(callback) {
			if (!post.about_title.en) return callback(null);

			fs.writeFile(__app_root + '/static/about_title_en.html', post.about_title.en, callback);
		},
		about_desc_ru: function(callback) {
			if (!post.about_desc.ru) return callback(null);

			fs.writeFile(__app_root + '/static/about_desc_ru.html', post.about_desc.ru, callback);
		},
		about_desc_en: function(callback) {
			if (!post.about_desc.en) return callback(null);

			fs.writeFile(__app_root + '/static/about_desc_en.html', post.about_desc.en, callback);
		},
		lessons_title_ru: function(callback) {
			if (!post.lessons_title.ru) return callback(null);

			fs.writeFile(__app_root + '/static/lessons_title_ru.html', post.lessons_title.ru, callback);
		},
		lessons_title_en: function(callback) {
			if (!post.lessons_title.en) return callback(null);

			fs.writeFile(__app_root + '/static/lessons_title_en.html', post.lessons_title.en, callback);
		}
	}, function(err, results) {
		res.redirect('back');
	});
};