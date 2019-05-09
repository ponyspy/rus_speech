var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	content: require('./content.js')(Model),
	options: require('./options.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index)
		.post(main.index.get_posts);

	router.route('/posts/:id')
		.get(main.index.post);

	router.route('/posts').get(function(req, res) {
		res.redirect('/');
	});

	router.route('/about')
		.get(main.content.about);

	router.route('/lessons')
		.get(main.content.lessons);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();