var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Post = Model.Post;
	var Category = Model.Category;

	module.index = function(req, res) {
		Post.find().sort('-date').populate('categorys').exec(function(err, posts) {
			Category.find().exec(function(err, categorys) {
				res.render('main/index.pug', { posts: posts, categorys: categorys });
			});
		});
	};

	module.get_posts = function(req, res) {
		var post = req.body;

		Category.findOne({ '_short_id': post.context.category }).where('status').ne('hidden').exec(function(err, category) {

			var Query = post.context.category !== 'all'
				? Post.find({ 'categorys': category._id })
				: Post.find();

			Query.where('status').ne('hidden').populate('categorys').sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, posts) {
				var opts = {
					posts: posts,
					locale: req.locale,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				if (posts && posts.length > 0) {
					res.send(pug.renderFile(__app_root + '/views/main/_posts.pug', opts));
				} else {
					res.send('end');
				}
			});

		});
	};

	module.post = function(req, res) {
		var id = req.params.id;

		Post.findOne({ '_short_id': id }).where('status').ne('hidden').populate('categorys').exec(function(err, post) {
			res.render('main/post.pug', { post: post });
		});
	};

	return module;
};