var sitemap = require('sitemap');

module.exports = function(Model, Params) {
	var module = {};

	var Post = Model.Post;

	module.sitemap = function(req, res, next) {

		Post.where('status').ne('hidden').exec(function(err, posts) {
			var arr_posts = posts.map(function(post) {
				return {
					url: '/posts/' + (post.sym ? post.sym : post._short_id)
				};
			});

			var site_map = sitemap.createSitemap ({
				hostname: 'https://' + req.hostname,
				// cacheTime: 600000,
				urls: [
					{ url: '/' },
					{ url: '/about' },
					// { url: '/lessons' },
				].concat(arr_posts)
			});

			site_map.toXML(function (err, xml) {
				if (err) return next(err);

				res.type('xml').send(xml);
			});

		});
	};


	return module;
};