var fs = require('fs');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;

	module.about = function(req, res) {

		async.parallel({
			about_title: function(callback) {
				fs.readFile(__app_root + '/static/about_title_' + req.locale + '.html', function(err, content) {
					callback(null, content || '');
				});
			},
			about_desc: function(callback) {
				fs.readFile(__app_root + '/static/about_desc_' + req.locale + '.html', function(err, content) {
					callback(null, content || '');
				});
			},
			members: function(callback) {
				Member.find().populate('categorys').exec(callback)
			}
		}, function(err, results) {
			if (err) return next(err);

			res.render('main/about.pug', results);
		});
	};

	module.lessons = function(req, res) {
		async.parallel({
			lessons_title: function(callback) {
				fs.readFile(__app_root + '/static/lessons_title_' + req.locale + '.html', function(err, content) {
					callback(null, content || '');
				});
			},
		}, function(err, results) {
			if (err) return next(err);

			res.render('main/lessons.pug', results);
		});
	};

	return module;
};